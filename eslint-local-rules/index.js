const PHYSICAL_PREFIXES = {
  ml: 'ms-',
  mr: 'me-',
  pl: 'ps-',
  pr: 'pe-',
  left: 'start-',
  right: 'end-',
  'border-l': 'border-s-',
  'border-r': 'border-e-',
  'rounded-l': 'rounded-s-',
  'rounded-r': 'rounded-e-',
  'rounded-tl': 'rounded-ss-',
  'rounded-tr': 'rounded-se-',
  'rounded-bl': 'rounded-es-',
  'rounded-br': 'rounded-ee-',
}

const PHYSICAL_EXACT = {
  'text-left': 'text-start',
  'text-right': 'text-end',
  'float-left': 'float-start',
  'float-right': 'float-end',
}

const PHYSICAL_PATTERN =
  /^-?(ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)(-|$)/

const PALETTE_PATTERN =
  /^(bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|shadow|accent|caret|divide|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/

const HEX_PATTERN = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/
const COLOR_FUNCTION_PATTERN = /\b(?:rgba?|hsla?)\(/
const DASH_PATTERN = /[‒–—―]/

function isClassNameAttribute(node) {
  return (
    node?.type === 'JSXAttribute' &&
    node.name?.type === 'JSXIdentifier' &&
    node.name.name === 'className'
  )
}

function classNameStringNodes(attribute) {
  const value = attribute?.value
  if (!value) return []
  if (value.type === 'Literal') {
    return typeof value.value === 'string' ? [{ node: value, text: value.value }] : []
  }
  if (value.type !== 'JSXExpressionContainer') return []
  return expressionStringNodes(value.expression)
}

function expressionStringNodes(expression) {
  if (!expression) return []
  if (expression.type === 'Literal') {
    return typeof expression.value === 'string'
      ? [{ node: expression, text: expression.value }]
      : []
  }
  if (expression.type === 'TemplateLiteral') {
    const quasis = (expression.quasis ?? [])
      .filter(
        (quasi) =>
          typeof quasi?.value?.cooked === 'string' || typeof quasi?.value?.raw === 'string',
      )
      .map((quasi) => ({ node: quasi, text: quasi.value.cooked ?? quasi.value.raw }))
    return [...quasis, ...(expression.expressions ?? []).flatMap(expressionStringNodes)]
  }
  if (expression.type === 'CallExpression') {
    return (expression.arguments ?? []).flatMap(expressionStringNodes)
  }
  if (expression.type === 'ArrayExpression') {
    return (expression.elements ?? []).flatMap(expressionStringNodes)
  }
  if (expression.type === 'ConditionalExpression') {
    return [
      ...expressionStringNodes(expression.consequent),
      ...expressionStringNodes(expression.alternate),
    ]
  }
  if (expression.type === 'LogicalExpression') {
    return [...expressionStringNodes(expression.left), ...expressionStringNodes(expression.right)]
  }
  if (expression.type === 'ObjectExpression') {
    return (expression.properties ?? []).flatMap((property) =>
      property?.type === 'Property' ? expressionStringNodes(property.key) : [],
    )
  }
  return []
}

function tokensOf(text) {
  if (typeof text !== 'string') return []
  return text.split(/\s+/).filter(Boolean)
}

function baseClass(token) {
  const withoutVariants = token.includes(':') ? token.slice(token.lastIndexOf(':') + 1) : token
  return withoutVariants.replace(/^!/, '').replace(/!$/, '')
}

const noPhysicalDirection = {
  meta: {
    type: 'problem',
    docs: { description: 'Use CSS logical properties so the RTL layout mirrors automatically.' },
    schema: [],
    messages: {
      physical: 'Physical direction class "{{token}}" breaks RTL. Use "{{replacement}}" instead.',
      inlineDirection:
        'Do not set direction inline. Let the html dir attribute and logical properties handle it.',
    },
  },
  create(context) {
    function checkAttribute(attribute) {
      for (const { node, text } of classNameStringNodes(attribute)) {
        for (const token of tokensOf(text)) {
          const base = baseClass(token)
          const exact = PHYSICAL_EXACT[base]
          if (exact) {
            context.report({
              node,
              messageId: 'physical',
              data: { token: base, replacement: exact },
            })
            continue
          }
          const match = PHYSICAL_PATTERN.exec(base)
          if (!match) continue
          const prefix = match[1]
          const negated = base.startsWith('-')
          const replacementPrefix = PHYSICAL_PREFIXES[prefix]
          if (!replacementPrefix) continue
          const rest = base.slice((negated ? 1 : 0) + prefix.length).replace(/^-/, '')
          const replacement = `${negated ? '-' : ''}${replacementPrefix}${rest}`
          context.report({ node, messageId: 'physical', data: { token: base, replacement } })
        }
      }
    }

    function checkStyle(attribute) {
      if (attribute?.name?.type !== 'JSXIdentifier' || attribute.name.name !== 'style') return
      const expression =
        attribute.value?.type === 'JSXExpressionContainer' ? attribute.value.expression : null
      if (expression?.type !== 'ObjectExpression') return
      for (const property of expression.properties ?? []) {
        if (property?.type !== 'Property') continue
        const key = property.key
        const name =
          key?.type === 'Identifier' ? key.name : key?.type === 'Literal' ? key.value : null
        if (name === 'direction') {
          context.report({ node: property, messageId: 'inlineDirection' })
        }
      }
    }

    return {
      JSXAttribute(node) {
        try {
          if (isClassNameAttribute(node)) checkAttribute(node)
          else checkStyle(node)
        } catch {
          // never let a malformed node break the lint run
        }
      },
    }
  },
}

const noLiteralColors = {
  meta: {
    type: 'problem',
    docs: { description: 'Use semantic color tokens instead of raw colors or palette utilities.' },
    schema: [],
    messages: {
      rawColor:
        'Raw color "{{value}}" found. Use a semantic token such as bg-surface or text-muted.',
      paletteUtility:
        'Palette utility "{{token}}" found. Use a semantic token such as bg-surface or text-muted.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        try {
          if (!isClassNameAttribute(node)) return
          for (const { node: stringNode, text } of classNameStringNodes(node)) {
            const hex = HEX_PATTERN.exec(text)
            if (hex) {
              context.report({ node: stringNode, messageId: 'rawColor', data: { value: hex[0] } })
            }
            const fn = COLOR_FUNCTION_PATTERN.exec(text)
            if (fn) {
              context.report({ node: stringNode, messageId: 'rawColor', data: { value: fn[0] } })
            }
            for (const token of tokensOf(text)) {
              const base = baseClass(token)
              if (PALETTE_PATTERN.test(base)) {
                context.report({
                  node: stringNode,
                  messageId: 'paletteUtility',
                  data: { token: base },
                })
              }
            }
          }
        } catch {
          // never let a malformed node break the lint run
        }
      },
    }
  },
}

const noUiDashes = {
  meta: {
    type: 'problem',
    docs: { description: 'Em and en dashes are banned in UI copy.' },
    schema: [],
    messages: {
      dash: 'Dash character "{{char}}" is not allowed in UI copy. Use a comma, colon, or a separate sentence.',
    },
  },
  create(context) {
    function reportText(node, text) {
      if (typeof text !== 'string') return
      const match = DASH_PATTERN.exec(text)
      if (match) context.report({ node, messageId: 'dash', data: { char: match[0] } })
    }

    return {
      JSXText(node) {
        try {
          reportText(node, node.value)
        } catch {
          // never let a malformed node break the lint run
        }
      },
      JSXAttribute(node) {
        try {
          const value = node.value
          if (!value) return
          if (value.type === 'Literal') {
            reportText(value, value.value)
            return
          }
          if (value.type !== 'JSXExpressionContainer') return
          for (const { node: stringNode, text } of expressionStringNodes(value.expression)) {
            reportText(stringNode, text)
          }
        } catch {
          // never let a malformed node break the lint run
        }
      },
    }
  },
}

const requireUrlBuilder = {
  meta: {
    type: 'problem',
    docs: { description: 'Internal hrefs must come from the shared route builder.' },
    schema: [],
    messages: {
      hardcoded: 'Hardcoded href "{{href}}". Build it with ROUTES from @/config/urls.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        try {
          const name = node.name
          const elementName =
            name?.type === 'JSXIdentifier'
              ? name.name
              : name?.type === 'JSXMemberExpression' && name.property?.type === 'JSXIdentifier'
                ? name.property.name
                : null
          if (elementName !== 'Link') return

          for (const attribute of node.attributes ?? []) {
            if (attribute?.type !== 'JSXAttribute') continue
            if (attribute.name?.type !== 'JSXIdentifier' || attribute.name.name !== 'href') continue
            const value = attribute.value
            if (value?.type !== 'Literal' || typeof value.value !== 'string') continue
            if (!value.value.startsWith('/')) continue
            context.report({ node: value, messageId: 'hardcoded', data: { href: value.value } })
          }
        } catch {
          // never let a malformed node break the lint run
        }
      },
    }
  },
}

export default {
  rules: {
    'no-physical-direction': noPhysicalDirection,
    'no-literal-colors': noLiteralColors,
    'no-ui-dashes': noUiDashes,
    'require-url-builder': requireUrlBuilder,
  },
}

const acorn = require('acorn')
const walk = require('acorn-walk')
const fs = require('fs')

/**
 * @param {string} pathToFile
 * @returns {Promise<string>}
 */
function readFile (pathToFile) {
    return new Promise(function (resolve, reject) {
        fs.readFile(pathToFile, 'utf8',function(error, data) {
            if (error) {
                reject(error)
            }

            resolve(data)
        })
    })
}

/**
 * @param {Property} property
 * @param {string|null} parentPath
 * @param {Map<string, string>} pathsMap
 * @returns {string}
 */
function getPath (property, parentPath, pathsMap) {
    if ('ObjectExpression' !== property.value.type) {
        if (parentPath && pathsMap.has(parentPath)) {
            return pathsMap.get(parentPath) + '.' + property.key.name
        }

        return property.key.name
    } else if (parentPath) {
        return parentPath + '.' + property.key.name
    }

    return property.key.name
}

/**
 * @param {Property} property
 * @return {boolean}
 */
const isStringLiteral = property => property.value.type === 'Literal' && typeof property.value.value === 'string'

/**
 * @param {Property} property
 * @return {boolean}
 */
const isFunction = property => ['FunctionExpression', 'ArrowFunctionExpression'].includes(property.value.type)

/**
 * @param {Property} property
 * @return {boolean}
 */
const isObject = property => property.value.type === 'ObjectExpression'

/**
 * @param {string} pathToJsFile
 * @returns {Promise<[]>}
 */
module.exports = async function (pathToJsFile) {
    const map = new Map()

    const ast = acorn.parse(await readFile(pathToJsFile))

    walk.recursive(ast, null, {
        ObjectExpression (node, parentPath, c) {
            node.properties.forEach(property => {
                let path

                const add = path => map.set(path, path)

                if ([isFunction, isObject, isStringLiteral].some(fn => fn(property))) {

                    add(path = getPath(property, parentPath, map))
                    if (isObject(property)) {
                        c(property, path)
                    }
                }
            })

            // удалить путь родителя, после того как все пути вложенных в него свойств были сформированы
            if (parentPath && map.has(parentPath)) {
                map.delete(parentPath)
            }
        },
    })

    return Array.from(map.values())
}
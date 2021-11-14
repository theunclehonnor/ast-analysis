const acorn = require('acorn')
const walk = require('acorn-walk')
const fs = require('fs')

/**
 * @param {string} pathToJsFile
 * @returns {Promise<string>}
 */
function transformJsFileToText (pathToJsFile) {
    return new Promise(function (resolve, reject) {
        fs.readFile(pathToJsFile, 'utf8',function(error, data) {
            if (error) {
                reject(error)
            }

            resolve(data)
        })
    })
}

/**
 * @param {Object} property
 * @param {string} parent
 * @param {Map<string, string>} map
 * @returns {string[]}
 */
function checkBeforeAddingToMap (property, parent, map) {
    if ('ObjectExpression' !== property.value.type) {
        if (parent && map.has(parent)) {
            const val = map.get(parent) + '.' + property.key.name

            return [val, val]
        } else {
            return [property.key.name, property.key.name]
        }
    } else {
        if (parent) {
            const val = parent + '.' + property.key.name

            return [val, val]
        } else {
            return [property.key.name, property.key.name]
        }
    }
}

/**
 * @param {Map<string, string>} map
 * @returns {[]}
 */
function convertMapToArray (map) {
    const resultList = []
    for (let res of map.values()) {
        resultList.push(res);
    }

    return resultList
}

/**
 * @param {string} pathToJsFile
 * @returns {Promise<[]>}
 */
module.exports = async function (pathToJsFile) {
    const map = new Map()

    const ast = acorn.parse(await transformJsFileToText(pathToJsFile))

    walk.recursive(ast, null, {
        ObjectExpression (node, state, c) {
            let parent = state

            node.properties.forEach((property) => {
                let key, value
                switch (property.value.type) {
                    case 'Literal':
                        if ('string' === typeof property.value.value) {
                            [key, value] = checkBeforeAddingToMap(property, parent, map)

                            map.set(key, value)
                        }
                        break
                    case 'FunctionExpression':
                    case 'ArrowFunctionExpression':
                        [key, value] = checkBeforeAddingToMap(property, parent, map)

                        map.set(key, value)
                        break
                    case 'ObjectExpression':
                        [key, value] = checkBeforeAddingToMap(property, parent, map)

                        map.set(key, value)
                        c(property, value)

                        break
                }
            })

            // удалить родителя, после того как все листы на данной итерации были созданы
            if (parent && map.has(parent)) {
                map.delete(parent)
            }
        },
    })

    return convertMapToArray(map)
}
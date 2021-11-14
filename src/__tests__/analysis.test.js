const util = require('../util')

describe('AstAnalysis', () => {
    test.each([
        ['/__fixtures__/example1.js', [
            'deep.nested1',
            'nested2',
            'fn',
            'numeric',
        ]],
        ['/__fixtures__/example2.js', [
            'deep.nested1.deep2.nested2',
            'deep.nested1.test',
            'deep.nested1.fn1',
            'nested3',
            'fn2',
            'numeric1',
        ]]
    ])('test №%#', async (pathToJsFile, expectedResult) => {
        const result = await util(__dirname + pathToJsFile)

        expect(result).toEqual(expectedResult)
    })
})
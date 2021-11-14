const obj = {
    deep: {
        nested1: {
            deep2: {
                nested2: 'text',
            },
            test: 'test',
            fn1: () => {}
        },
    },
    nested3: 'abc',
    fn2: function () {},
    numeric1: '1',
    // не пройдет, т.к листом может быть либо строка, либо функция
    numeric2: 2,
}
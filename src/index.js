const recast = require("recast");

const code = `
   let a = 1;let b = 2;
   if(a === 1 && b === 2  && a === b && b=== a &&  a!== 2 ){
            if(a === 2){
                 if(a >= 4){
                    if(a<=3){return 'surejun'}
                    if(a !== 2){return 'surenjun1'}
                 }
                 if(a === 2){
                       return 'surenjun2'
                 }  
            }
       if(b ===3 ){return 'surenjun3'}
   }
   if(a === b){return 'surenjun4'}
`;

const tree = recast.parse(code).program.body;

const logicalExpression = (left, right, operator ,preLogiclStr) => {
    //左值处理
    const thisLeft = left.left;
    const thisRight = left.right;
    const thisOperator = left.operator;

    //右值处理
    const thatLeft = right.left;
    const thatRight = right.right;
    const thatOperator = right.operator;

    if (thisLeft) {
        return preLogiclStr + `${logicalExpression(thisLeft, thisRight, thisOperator,preLogiclStr)}${operator}${logicalExpression(thatLeft, thatRight, thatOperator,preLogiclStr)}`;
    }
    return preLogiclStr + `${left.name || left.value }${ operator  }${right.value || right.name}`
};

let str ='';
~function ergodicFn(tree , preLogiclStr) {
    tree.map(item => {
        //判断条件递归
        if (item.type && item.type === "IfStatement") {
            const thisTest = item.test;
            str = logicalExpression(thisTest.left, thisTest.right, thisTest.operator, preLogiclStr);
            const thisBody = item.consequent.body;
            if (thisBody) {
                ergodicFn(thisBody ,`${str}且`)
            }
        }

        //输出结果
        if(item.type && item.type === 'ReturnStatement'){
            console.log(`条件:${str} 输出${item.argument.value}`);
        }
    })
}(tree,'');

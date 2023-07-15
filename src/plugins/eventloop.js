const promise3 = new Promise((resolve, reject) => {
    resolve('foo');
  });

setTimeout(()=>{
    console.log(1)
    promise3.then(() => {
        console.log(6);
      });
},0)

setTimeout(()=>{
    console.log(2)
},0)

const promise1 = new Promise((resolve, reject) => {
    resolve('foo');
  });

  const promise2 = new Promise((resolve, reject) => {
    resolve('foo');
  });
  
  promise1.then(() => {
    console.log(3);
  });

  promise2.then(() => {
    console.log(4);
  });

  console.log(5)
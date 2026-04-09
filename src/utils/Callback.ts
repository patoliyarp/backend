function processData(data: any, cb: any): any {
  console.log("process user data", data);
  cb();
}

function fetchFake(cb: Function) {
  const user = { id: 1, name: "alex" };
  cb(user);
}

function fetchData(cb: Function) {
  fetch("https://dummyjson.com/user/1")
    .then((user) => {
      return user.json();
    })
    .then((data) => cb(data))
    .catch((err) => console.log("error while fetch data", err));
}

fetchData((data: any) => {
  processData(data, () => {
    console.log("data fetched success");
  });
});

fetchFake((data: any) => {
  processData(data, () => {
    console.log("fetch simulation success");
  });
});

function first(cb: Function) {
  setTimeout(() => {
    console.log("first callback 1");
    cb();
  }, 500);
}

function second(cb: Function) {
  setTimeout(() => {
    console.log("second callback 2");
    cb();
  }, 500);
}

function third(cb: Function) {
  setTimeout(() => {
    console.log("third callback 3");
    cb();
  }, 500);
}

// execute callback functions
first(() => {
  second(() => {
    third(() => {
      console.log("executed from callback hell");
    });
  });
});

//create promise for consumption
function getDataWithPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("data fetched using promise");
    }, 1000);
  });
}

function processDataWithPromise() {
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      resolve("data process in promise");
    }, 1000);
  });
}

function returnDataWithPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("processed data is returned using promise");
    }, 1000);
  });
}

// consume promise with then catch
getDataWithPromise()
  .then((result) => {
    console.log("returned result:", result);
  })
  .catch((err) => {
    console.log("error while get data", err);
  });

// consume promise with async await
async function getDataWithAsync() {
  try {
    const result = await getDataWithPromise();
    console.log("result :", result);
  } catch (error) {
    console.error(error);
  }
}

function ProcessWithThen() {
  getDataWithPromise()
    .then(processDataWithPromise)
    .then(returnDataWithPromise)
    .then((result) => console.log("return data using then", result));
}

ProcessWithThen();
// hell then
getDataWithPromise().then((data) => {
  processDataWithPromise().then((processed) => {
    returnDataWithPromise().then((final) => {
      console.log(final);
    });
  });
});

async function ProcessWithAsync() {
  const rowData = await getDataWithPromise();
  const processData = await processDataWithPromise();
  const result = await returnDataWithPromise();
  console.log("result with async await", result);
}

ProcessWithAsync();

// Async JavaScript: Promises & Callbacks...



// 1. Understanding Synchronous Code Execution ("Sync Code")...

// JS is Single-Threaded.
// Single threading means that JS can only execute on task at a time.
// If we have some code - all that code will run in sequence and won't run simultaneously.

// Code executes step by step - in order.
// For eg: we have 4 code with A,B,C & D.
// B runs after A but blocks C from running until it's finished.


---------------------------------------------------------------------------------------------------


// 2. Understanding Asynchronous Code Execution ("Async Code")....

// What if we have certain operations which take a bit longer.
// Let's say we have a timeout code.
// It would take time which we wouldn't wanna wait.
// It would prevent more code to execute untill the timout is complete.
// Other examples for it are HTTP requests, getting user location.
// These would take a bit longer to finish which will block other code to execute.

// The other operation shouldn't wait for previous one for taking longer time to execute.
// JS has a solution for that.

// We have Asynchronous Code Execution.
// If certain operations take longer then we can offload them to the browser.
// Let's take the example for setTimeout().
// We tell the browser to set timer but we then let the browser do that and therefore our code can execute right way.
// Browser is able to use multiple threads = one for JS and other for the operations we offloaded to it.
// Therefore our JS code isn't blocked.

// Browser needs a way to communicate back to our JS code.
// For that we often use Callback Function.
// For eg: in setTimeout(), we pass a callback function as 1st arg.
// That callback function is the function the browser should call once the operation is done.


------------------------------------------------------------------------------------------------------


// 3. Blocking Code & The "Event Loop"...

// Let's add a for loop and we have higher number for exit condition.
let result = 0;
for (let i = 0; i < 100000000; i++){
  result += i;
}
console.log(result);

// For me it didn't take any time to appear on the console but for Max it took.
// Now with his POV, we click the button before the result appears - I had to add more 0 to the number.
// The result will still be on the top and the clicked console will be the next.

// The event listener is handed to the browser to work but the loop here is not.
// JS execution is blocked until the loop is executed.

// The browser recongnises the function we clicked before the loop is executed but it let's JS execute one operation and then execute the clicks.
// That function is memorized by JS and executes them when one operation(for loop) is finished.

// This is how JS works and how it works with Async-Sync code.
// It uses a concept called Event Loop..

// We saw event loop in the BTS pdf with heap and stack and so.

// What is event loop?
// It helps us deal with Async code, it helps us deal with callback functions which typically are used in such async code scenarios.

// We have this code.
const greet = () => {
  console.log('Hi');
}
const showAlert = () => {
  alert('Danger!');
}
setTimeout(showAlert, 2000);
greet();

// When this code executes, in stack - which is the part of our JS engine.
// Certain other things will be offloaded to the browser.
// Such as DOM API, navigator.geolocation, setTimeout...
// The browser gives us a bridge where we can talk to certain browser APIs from inside our JS code to offload certain work for eg.

// Both functions are created.
// The first function that's called is setTimeout which is actually a browser API for JS.
// It will be set in stack.
// It reaches out to the browser.
// It sets up the ongoing timer in the browser.
// It doesn't block any execution.
// The alert isn't shown as the timer is managed by browser.
// JS will move onto greet() - this will set on stack.
// Greet() is executed before the timer is completed.
// console.log('hi') gets executed.
// At some point timer is executed.
// Let's say it's executed whilst greet() is executed(not that it would take much time but for understanding purpose only).
// We need to tell JS that Settimeout has a callback function - showAlert, which should be executed.
// For this a message queue is used.
// It's provided by the browser and linked to JS.

// In this message queue, the browser registers any code that should execute once we have time for it.
// Here the showAlert function is registered as a to-do task - but it's not executed right away.
// Now that the greet() is executed, the call stack is empty again.
// We need to get the message of this showAlert to-do in our call stack.

// For this we use Event Loop.
// It's build into the browser.
// It's not part of the JS engine but of the host environment.
// The job of event loop is to synchronize the call stack in the engine with our waiting messages.
// Event loop runs all the time and always sees - is the stack empty, do we have pending to-do lists.
// If the stack is empty, the loop executes and it pushes any waiting messages or any to-do functions into the call stack.

// The showAlert runs which calls the alert message.
// Once this is done the stack is empty again.

// Now we can understand how the app.js functions works when clicked on the EL and the for loop. As for loop executes first even if we clicked the button first as the stack wasn't empty with for loop and the click was stored as a to-do message.


------------------------------------------------------------------------------------------------------------


// 4. Sync + Async Code - The Execution Order....

// Bit deeper in Async and Callback.
// Comment out the for loop.
// In track user handler we wanna get user location instead of click.
function trackUserHandler() {
  navigator.geolocation.getCurrentPosition();
}
// We have the method of getCurrentPosition() which takes 3 potential args.
// 1 - success callback if the location is successful.
// 2 - Error callback if location isn't fetched successfully.
// 3 - Options of how the position should be fetched.

// So we will pass in the functions inside the getCurrentPosition().
// We don't need to pass the options.
function trackUserHandler() {
  navigator.geolocation.getCurrentPosition(posData => {console.log(posData)}, error => {
    console.log(error)
  });
}

// We get the location.
// We get the successful location.
// Now to simulate the error object - we click on the block button when we get the location permission dialog.

// GetcurrentPosition offloads this task to the browser.

// If we do something after calling getCurrentPosition.
// console.log('getting position...')
// This will be executed first even it's after the position as we learned about the event loop.


--------------------------------------------------------------------------------------------------------


// 5. Multiple Callbacks & setTimeout(0)...

// Let's say in posData we wanna set a timer of 2 secs, after that the response should be displayed.

function trackUserHandler() {
  navigator.geolocation.getCurrentPosition(
    (posData) => {
      setTimeout(() => {
        console.log(posData);
      }, 2000)
    },
    (error) => {
      console.log(error);
    }
  );
  console.log("getting position...");
}

// Here we have a callback in another callback which is part of the main callback which is trackuserhandler which is the callback of the EL.
// Over time it's harder to read with all these nested callbacks.

// The function takes additional time for obtaining location along with 2 secs we set.
// Another exciting thing here we can see is - if we set another timer in the getCurrentPosition() above the console.log(gettingposition...), would it execute before the console as we set the timer to 0.

setTimeout(()=>{
  console.log('Timer Done!')
}, 0)

// No, even though we set the timer of 0, the timer executes after the console.
// As we learned the browser has to take the route over the message queue and event loop to execute a callback function.
// Therefore console code executes right away before settimer.

// The time set in the timer isn't the guaranteed time but it's the minimum.


---------------------------------------------------------------------------------------------------------


// 6. Getting Started with Promises...

// If we have callbacks nested into eachother which are hard to read = we enter CALLBACK HELL.

// JS has solution for that with the concept of PROMISES....
// It allows us to write easy readable code = with the help of THEN special keyword.
// We pass a callback to THEN, and we simply add another THEN block if we have another task that depends on first task.

// SetTimeout or getCurrentPosition has no THEN approach(promise approach).
// More modern API provided by the browser embrace promises.
// setTimeout can't work with promise but we can wrap them into promise supported code if we want.

// We will learn about functionalities that embrace promise internally and natively...

// First with internal.
// Add a new function with duration arg.
const setTimer = (duration) => {
  setTimeout(()=>{},duration)
}

// Now we have a callback function in a seperate function.
// We build a new promise which is in the end an object.
// It's a class built in JS, it takes a function itself as an arg.
// The function will be executed right away when this promise is constructed. 
const setTimer = (duration) => {
  const promise = new Promise(()=>{});
  setTimeout(()=>{},duration)
}

// It's on us to think what should this promise do or wrap itself around.
// The function passed in the constructor of Promise takes 2 args.
// Now each arguments are themselves a function.
// A Resolve Function and A Reject Function - we can name these parameters however we wanna call but we will stick to the function names.
// In the function body we will define what should happen as this constructor is called right away.

const setTimer = (duration) => {
  const promise = new Promise((resolve, reject)=>{});
  setTimeout(()=>{},duration)
}

// Here we set the timer.
// We return the promise after creating the const promise so that we can use it wherever we call setTimer.
const setTimer = (duration) => {
  const promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{

    },duration)
  });
  return promise;
}

// Now with setTimeout() - we call resolve function.
// We just execute it.
// We'll not pass the concrete functions into promise, it's built in into browser.
// The browser executes the functions for us when it creates a promise.
// The function is coming from the JS engine to be precise.
// Resolve function will internally mark the promise object as resolved - as done.
// We here call resolve once the timer is done.
// We can pass in value in the resolve function - could be a text, an object or an array, etc.

const setTimer = (duration) => {
  const promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve('Done!');
    },duration)
  });
  return promise;
}

// For now we don't look at the reject and call this setTimer function in place of setTimeout() on the trackuserhandler.
// We pass the duration in.
// Now setTimer returns a promise.

function trackUserHandler() {
  navigator.geolocation.getCurrentPosition(
    (posData) => {
      setTimer(2000);
    },
    (error) => {
      console.log(error);
    }
  );
  setTimeout(() => {
    console.log("Timer Done!");
  }, 0);
  console.log("getting position...");
}

// Now on this promise object we can call THEN.
// We call this THEN method and it will execute whenever this promise resolves.
// A promise can resolve more than once.
// It resolves when resolve() is called there in the promise.
// It happens when the timer is done.

    (posData) => {
      setTimer(2000).then();
    };

// In here we get any data that might be resolved - here it's 'Done!'.
// We console.log(data, position data)
(posData) => {
  setTimer(2000).then(data => {
    console.log(data, posData)
  });
},

// So when we track our position, we see the coordinates but also Done! text on the coordinates.

// We use the setTimer() on the callbacks.

function trackUserHandler() {
  navigator.geolocation.getCurrentPosition(
    (posData) => {
      setTimer(2000).then((data) => {
        console.log(data, posData);
      });
    },
    (error) => {
      console.log(error);
    }
  );
  setTimer(1000).then(()=> {
    console.log('Timer Done!')
  })
  console.log("getting position...");
}


--------------------------------------------------------------------------------------------------------


// 7. Chaining Multiple Promises...

// We will promisify getCurrentPosition...

// We create a function.
// We move the navigator - geolocation inside here.
// And to get current position we will have to pass the callbacks that are mandatory for it.
const getPosition = (opts) => {
  navigator.geolocation.getCurrentPosition(success => {}, error => {}, opts);
}

// Now we wrap this up with promise.
// We create promise class.
// And move the navigator call in the promise function.
// And then return promise.
const getPosition = (opts) => {
  const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(success => {}, error => {}, opts);
  });
  return promise;
}

// We resolve in the getcurrent position success and call success in it.
// So we are passing the data from getcurrent position into our promise.
// So wherever we listen to it with THEN, we get that data.
const getPosition = (opts) => {
  const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(success => {
      resolve(success)
    }, error => {}, opts);
  });
  return promise;
}

// Now we use this function.
function trackUserHandler() {
  getPosition().then(posData => {
    console.log(posData);
  });
  setTimer(1000).then(() => {
    console.log("Timer Done!");
  });
  console.log("getting position...");
}

// Now we can combine setTimer with getPosition.
// We set the timer in posData.
// We use THEN and get the data from the setTimer method by placing console.log in it.
function trackUserHandler() {
  getPosition().then(posData => {
    setTimer(2000).then(data => {
      console.log(posData);
    })
  });
  setTimer(1000).then(() => {
    console.log("Timer Done!");
  });
  console.log("getting position...");
}
// But again we have some nesting in here which is not appropriate...

// We should take advantage of a concept called CHAINING...

// Here we get our position data of that promise.
// We wanna call setTimer in the position data.
// SetTimer() will return a new promise.
// Now we can return setTimer() inside of the function we passed it to and what happens is...
// The overrall promise which is created on the getPosition().then is now setback from being resolved to being pending.
// A promise can be Pending or be Resolved or have an Error.

function trackUserHandler() {
  getPosition().then(posData => {
    return setTimer();
  });
  setTimer(1000).then(() => {
    console.log("Timer Done!");
  });
  console.log("getting position...");
}

// Here the promise was resolved after we got the position but by returning something inside of the function we set it back to being pending and it will now wait for the promise in the function - setTimer() which we returned here to resolve.

// Now we can add new THEN after the first one.
// In there we get the data of the inner promise - setTimer() which in this case is the timer data we could log.
// If we also needed the position data we could store it in some variable outside the chain.
// We can store posData in positionData so that we could get access to it which is defined outside of all these functions in the console.log(data).

function trackUserHandler() {
  let positionData;
  getPosition().then(posData => {
    positionData = posData;
    return setTimer(2000);
  })
  .then(data => {
    console.log(data, positionData)
  })
  setTimer(1000).then(() => {
    console.log("Timer Done!");
  });
  console.log("getting position...");
}

// Now we have something we call promise chaining.
// There are multiple steps to this promise.
// We wait for the first promise to finish and return something new which doesn't have to be a promise - could be string or other data, which would be wrapped into a promise automatically.
// Then we will wait for the other promise to be resolved, for non-promise data it would resolve instantly.
// And when that promise is finished we move to the next step & execute the next THEN with the data we got from the promise.

// Here with then we have step after step instead of step inside of step.


-----------------------------------------------------------------------------------------------------


// 8. Promise Error Handling...

// We can return any kind of data in the THEN() of getPosition() and it will be converted to a promise and wrapped into a promise.
// The core idea of promise chaining is we can have step after step and the second gets executed when the first step is done.

// Let's look at Errors.
// When we look into getPosition we have the error arg on the navigator.
// When the location isn't allowed on the browser we see that error.

// Now we wanna handle the error on the promise chain.
// Thus on the promise configuration we will use the Reject argument.
// We call reject() inside of the error callback and pass our error.

const getPosition = (opts) => {
  const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        resolve(success);
      },
      (error) => {
        reject(error);
      },
      opts
    );
  });
  return promise;
};

// Reject will mark the promise as Failed.
// The promise isn't resolved - its not pending but it has an error.
// Error aren't handled with the functions we pass into THEN().
// Instead THEN takes a second arg.
// The first arg is the callback function that should be executed if the promise resolves.
// The second arg is the potential error we might have.

// We pass the second function into THEN.
function trackUserHandler() {
  let positionData;
  getPosition()
    .then((posData) => {
      positionData = posData;
      return setTimer(2000);
    }, err => {
      console.log(err);
    })
    .then((data) => {
      console.log(data, positionData);
    });
  setTimer(1000).then(() => {
    console.log("Timer Done!");
  });
  console.log("getting position...");
}

// When we block the location - we see the error.
// Also we see undefined in there.

// Now we have another method to add to our promise chain as we added another function callback to the THEN() method and it would seem good but for more understanding purpose we will use this method.
// The CATCH() method.

// Catch() can be anywhere on the promise chain.
// Though the exact position does matter.
// Now for eg: we add catch after the first Then block before the second then block and add the error inside it. It will work the same.
function trackUserHandler() {
  let positionData;
  getPosition()
    .then((posData) => {
      positionData = posData;
      return setTimer(2000);
    })
    .catch(err => {
      console.log(err);
    })
    .then((data) => {
      console.log(data, positionData);
    });
  setTimer(1000).then(() => {
    console.log("Timer Done!");
  });
  console.log("getting position...");
}

// Catch is just the alternative to the second argument we use in the THEN block.
// These both approach catch any errors, rejections produced anywhere in our promise chain prior to this catch block or prior to the place where we added it as a second arg.

// If we had multiple THEN blocks - and if error is to be occured in anyone of them, the error catch logic is to run - or the logic in the nearest second argument will run.

// If the first promise is rejected - all the THEN blocks will be skipped until we reach a catch block or a second argument to handle the error..

// Now if there is a rejection on the first promise - the THEN blocks will be skipped until our CATCH block but the next THEN block after the Catch will run.
// CATCH method doesn't cancel the entire promise chain.
// So the positioning of the Catch block does matter.
// If we wanna cancel the promise chain we have to move the catch method on the end of all the then blocks.

// Catch will set the promise to pending and the next then blocks will execute if the promise is resolved.

// As soon as we start working with Async code - promises will be used.


-----------------------------------------------------------------------------------------------------


// 9. Async/ await...

// We comment the code below the data THEN block which we don't need now.
function trackUserHandler() {
  let positionData;
  getPosition()
    .then((posData) => {
      positionData = posData;
      return setTimer(2000);
    })
    .catch((err) => {
      console.log(err);
    })
    .then((data) => {
      console.log(data, positionData);
    });
  // setTimer(1000).then(() => {
  //   console.log("Timer Done!");
  // });
  // console.log("getting position...");
}

// Modern JS has an alternative which will use the promises but will allow to omit the THEN and CATCH method to make our code look more like Synchronous code.
// That's ASYNC AWAIT.

// What's it about?
// We can use async await in functions and only functions.
// We enable it by adding async keyword in front of the function keyword - async function functionName(){}.
// For arrow functions - const function = async () => {}.

// With async in front of the function = it automatically returns a Promise.
// The entire function wraps all it's content into a promise behind the scenes.
// One effect is that we could call THEN where the function we asynced - is executed. We don't call it here though.

// We can use a special keyword AWAIT inside the Async function.
// We use it before any promise in there = here we have external promises like getPosition() and we can call it like this - await getPosition().

// What does Await does?
// It waits for the promise to resolve or to fail and the next line thereafter will only execute once that's the case.
// The data which might be resolved - positionData for eg here will then be returned - we can here say = 
const posData = await getPosition();

// So we can omit the .then() of the posData and don't return setTimer(2000). We call it after getPosition()

async function trackUserHandler() {
  let positionData;
  const posData = await getPosition();
  setTimer(2000)
    // .then((posData) => {
    //   positionData = posData;
    //   return setTimer(2000);
    // })
    .catch((err) => {
      console.log(err);
    })
    .then((data) => {
      console.log(data, positionData);
    });
}

// So what we did is we wait for the getPosition() to get resolved and the result will be stored in the const.
// Then setTimer(2000) is executed.
// Now timer returned some data - so we can store it in some const and call Await on it too..
const timerData = await setTimer(2000)
// Course we don't have to store the data if we aren't interested.

// So now we await the next process...
// We also comment out the next catch and then code block.
// We remove the variable of positionData.
// Now we can console.log(timerData, posData).
// We just temporarily lost the error handling here.
async function trackUserHandler() {
  const posData = await getPosition();
  const timerData = await setTimer(2000);
  console.log(timerData, posData)
    // .then((posData) => {
    //   positionData = posData;
    //   return setTimer(2000);
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
    // .then((data) => {
    //   console.log(data, positionData);
    // });
}
// We can see the output in the console.


// It looks like we are blocking the execution.
// This can be a dangerous thing about asyn-await.
// Looks like we are changing the working of JS.
// But that's NOT what happening here.

// Instead async wraps everything into one promise and whenever we await for some other promise which is wrapped in the main promise to resolve - it returns the internal promise as part of the main promise it created for us.
// And adds an invisible THEN block. In there it will get the result of this promise and store it in the variable.

// It replicated the THEN block BTS.
// It doesn't block code execution.
// It's just TRANSFORMED the code BTS so that we can write shorter code.


------------------------------------------------------------------------------------------------------------


// 10. Async/ await & Error Handling...

// Await always moves on the next line when the previous line is resolved.
// What if we have an error?
// We can use the normal error handling - the TRY CATCH.
// We TRY the line of code and then CATCH the error of that and do whatever we wanna do with that error.

async function trackUserHandler() {
  try{
    const posData = await getPosition();
  } catch(error){
    console.log(error)
  }

  const timerData = await setTimer(2000);
  console.log(timerData, posData)
}

// So everything in the TRY - so all the steps in there would only execute if their previous ones are succeeds.
// If not succeeded - we will make into the catch block.

async function trackUserHandler() {
  try{
    const posData = await getPosition();
    const timerData = await setTimer(2000);
  } catch(error){
    console.log(error)
  }
  console.log(timerData, posData)
}

// The console line will always execute no matter if we made into try or into catch.
// We also should store the const in the function scope as they are inside the try scope...
// So that we can use those variables inside the whole function.

async function trackUserHandler() {
  let posData;
  let timerData;
  try{
    posData = await getPosition();
    timerData = await setTimer(2000);
  } catch(error){
    console.log(error)
  }
  console.log(timerData, posData)
}
// We see undefined undefined in the console as the variables inside the console log never received any values.


-----------------------------------------------------------------------------------------------------


// 11. Async/ await vs "Raw Promises"...

// Async and Await - all these operations are provided by the browser such that they can be offloaded to it.
// In modern browsers - these are better from a performance perspective.

// One downside is with async await is that we can't run tasks simultaneously inside of a same function.

// With THEN and CATCH - The timer and the console line would be executed right away. 
// Now we make that code uncommented - and with asyn we can see that these lines are executed when the above TRY CATCH is executed.
// This happens cause of await as the code which has it are automatically wrapped in their own THEN blocks.
// The setTimer() and console.log('Timer Done!') has their own THEN blocks cause AWAIT does that to em.

// We can fix this by offloading the setTimer and console to another function which should execute along with trackuserHandler but we know what async await does.

// Only functions have async await.
// We can't use them outside functions.
setTimer(2000); // We can't use async on it.
// But we can use the IFFY on it to make a workaround..
(async function(){
  await setTimer(2000)
})();
// But with THEN - 
setTimer(2000).then() // It looks more efficient.


----------------------------------------------------------------------------------------------------------


// 12. Promise.all(), Promise.race() etc...

// There are couple of nice methods related to Promise.

// Let's say we have multiple promises which we wanna orchestrate in a certain way - to make sure they are executed together in a certain way.
// For eg: we have 2 promise - our getPosition() & setTimer() in a new scenario (it won't make usable sense but for the understanding purpose) where we want to execute the one that's faster.
// Now if the timer is executed before the position we wanna do something else. Sure we can setTimeout on the configuration object but we don't do that cause we are understanding this right!

getPosition();
setTimer(1000);
// Here we use the keyword Promise and use a method on it - race() which takes an array of promises.
Promise.race([
  getPosition();
  setTimer(1000);
]);
// Race itself also returns a promise with the result of the fastest returned promise in the array.
// We can build a normal THEN Catch chain here based on race.
Promise.race([
  getPosition(),
  setTimer(1000)
]).then();
// The one that finished earlier will be handled by the THEN CATCH chain.
// In THEN we get back some data we can console.
Promise.race([
  getPosition(),
  setTimer(1000)
]).then(data => {
  console.log(data)
});
// Here we get Done! as answer.

// If we wanna have code only to be executed after the promises are executed (we can achieve with multiple then blocks or async await). 
// But we want combined data of the promises.
// We use Promise.all()
// It also takes all promises inside the array and it's then block returns all that data in an array.
Promise.all([getPosition(), setTimer(1000)]).then(promiseData => {
  console.log(promiseData)
})
// We can also do some operation where we don't need the data but we just need couple of things to finish before we execute some other.
// Here if one promise is rejected - everything is rejected and we get an error which we could handle with a catch block.
// Here it's all resolved and at least one rejected.

// If we want all to succeed or all to fail - we have a scenario - 
Promise.allSettled();
// Also takes array of promises.
// It also gives all promises data...
Promise.allSettled([getPosition(), setTimer(1000)]).then(promiseData => {
  console.log(promiseData)
});
// Now if we click block we get an array with different kinda data with objects -
// Output of 1st promise which was rejected and the 2nd promise which was resolved.
// And if we allow both the promises are fulfilled and their values..
// Thus it doen't cancel the execution of other promises if one of them is rejected.


------------------------------------------------------------------------------------------------------------


More on Promises: https://developers.google.com/web/fundamentals/primers/promises

More on async/ await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
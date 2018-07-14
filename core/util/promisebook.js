class PromiseBook {

    constructor(promisePoints = [], option = 0, callback) { 
    	//Đối tượng promiseBook
        this.promiseBook = {
			promise: [],				//List of promise
			book_status: 0,				//status of book 
										//  -1: has error
										//   0: no error
			callback: null,  // run callback when book_status = 2 finish
			option: 0			// 0: run callback with no error
								// 1: run callback with error
								// 2: run callback when have any error
								// 3: stop without run callback when have error
								// 4: stop and run callback when have error
		};

    	this.createPromiseBook(promisePoints, option, callback);
    }

	//promisePoints maybe and string or function
	createPromiseBook(promisePoints = [], option = 0, callback) {
		//Add promisePoints to promiseBook
		for (var k in promisePoints) {
			//promisePoint object include: point, name, typeof, status and err message
			let obj = {
				fnc: null,
				name: null,
				typeof: null,
				finish: false,
				err: ''
			}

			//if promisePoints is an string
			if(typeof  promisePoints[k] == 'string') {
				obj.name = promisePoints[k];
				obj.typeof = 'string';
			}

			//if promisePoints is an function
			if(typeof  promisePoints[k] == 'function') {
				obj.fnc = promisePoints[k];
				obj.name = promisePoints[k].name;
				obj.typeof = 'function';
			}
			this.promiseBook.promise.push(obj);
		}

		this.promiseBook.option = option;
		this.promiseBook.callback = callback;
	};

	updatePointStatus(pointName, err = '') {
		let bool = true;
		let has_error = false;
		let arrError = [];
		// 3: stop without run finishFunction when have error
		// 4: stop and run finishFunction when have error
		if((this.promiseBook.book_status == -1) && 
			((this.promiseBook.option == 3) || (this.promiseBook.option == 4))) return;


		for (var k in this.promiseBook.promise) {
			//Find promise-point
			if(this.promiseBook.promise[k].name == pointName) {
				//Update promise-point
				this.promiseBook.promise[k].finish = true;
				this.promiseBook.promise[k].err = err;

				//Have error				
				if(err != '') {
					arrError.push(err);
					this.promiseBook.book_status = -1;	//has error
					//When have error and option is run finishFunction (option = 2 or 4)
					if((this.promiseBook.option == 2) || (this.promiseBook.option == 4)) {
						//run finishFunction
						this.promiseBook.callback(this.promiseBook.promise[k].err, this.promiseBook);
					}
				}
			}

			bool = bool && this.promiseBook.promise[k].finish;
		}

		//if all of promise is finish
		if(bool == true) {
			// 0: run callback with no error
			if(this.promiseBook.book_status == 0) {
				this.promiseBook.callback(null, this.promiseBook);
			} 
			// 1: run finishFunction with error
			else {
				this.promiseBook.callback(arrError, this.promiseBook);
			}
		}
	}
}

module.exports = PromiseBook;
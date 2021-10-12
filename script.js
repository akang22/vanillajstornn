/* Next 3 classes are tensors.
 * Ideally, if this was java, I would have Add and Multiply inherit from Tensor. I don't know how to do prototypal OOP yet so I just won't have it here yet.
 * Basically, these are classes that help you represent the way the weights and values become the final value. Doing it like this allows us to automate the differentiation / gradient calculation.
 *
 *
 * TODO:
 * - Add TDD for these classes
 * - Continue on with using tensors for my Tensor operations.
 */
class TensorTools {
	constructor() {
		if (this instanceof TensorTools) {
			throw Error('This class is intended to be static (used for its methods) and is not supposed to be instantiated.');
		}
	}

	static assert(condition) {
		if (!condition) {
			throw new Error("Assertion failed");
		}
	}

	static getNumDimensionsOf(ts) {
		var dimCount = 0;
		while (typeof ts != "number") {
			ts = ts[0];
			dimCount++;
		}
		return dimCount;
	}

	static getDimensionsOf(ts) {
		var dimsSoFar = new Array(this.getNumDimensionsOf(ts));
		var dimCount = 0;
		while (typeof ts != "number") {
			dimsSoFar[dimCount] = ts.length;
			ts = ts[0];
			dimCount++;
		}
		return dimsSoFar;
	}

	static flatten(ts) {
		return [ts.flat(Infinity), this.getDimensionsOf(ts)];
	}

	static flattenedIndex(dims, access) {
		var curIndex = 0;
		this.assert(dims.length == access.length);
		for (var i = 0; dims.length > i; i++) {
			this.assert(dims[i] > access[i] && access[i] > 0);
			curIndex *= dims[i];
			curIndex += access[i];
		}
		return curIndex;
	}

	static zeroes(len) {
		return new Array(len).fill(0);
	}
}


class Tensor {
	// arr is a multidimensional array)
	// needsGrad is a boolean, asking if the gradient is used (and should be calculated when recursed on)
	constructor(arr, needsGrad) {
		this.arr = arr;
		this.needsGrad = needsGrad;
		this.grad_arr = TensorTools.zeros(arr.flat(Infinity).length);
		this.name = "Tensor";
	}

	backward() {
		return false;
	}
}

class Add {
	// x, y are both tensors
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.name = "Add"
		
		this.item = x.item + y.item
		this.needsGrad = true;
		this.grad = 0;
	}

	backward() {
		if (this.x.needsGrad) {
			this.x.grad = this.grad;
			this.x.backward();
		}
		if (this.y.needsGrad) {
			this.y.grad = this.grad;
			this.y.backward();
		}
	}
}

class Multiply {
	// x, y are both tensors
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.name = "Multiply"

		this.item = x.item * y.item
		this.needsGrad = true;
		this.grad = 0;
	}
	
	backward() {
		if (this.x.needsGrad) {
			this.x.grad = this.grad * this.y.item;
			this.x.backward();
		}
		if (this.y.needsGrad) {
			this.y.grad = this.grad * this.x.item;
			this.y.backward();
		}
	}
}

console.log("============LOGS START HERE============")

arr = [[0, 1, 2, 3], [3, 2, 1, 0], [3, 5, 6, 1], [3, 8, 3, 4]]

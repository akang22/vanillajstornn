// Dear Future Reader Of My Code,

// If this looks like Java, that's because it is.
// I'm too lazy to learn how the normal javascript folks do it (well I do; using prototypes). 
// But I think this is way better and safer for some reason.
// I also was too lazy to learn how TypeScript differs from JavaScript.
// Getting me one step closer to Java.
// Too bad!

// Andrew Kang

function callFunction(func) {
	return new function() { func() };
}

class Tensor {
	// item is the tensor (multidimensional array)
	// needsGrad is a boolean, asking if the gradient is used (and should be calculated when recursed on)
	constructor(item, needsGrad) {
		this.item = item;
		this.needsGrad = needsGrad;
		this.grad = 0;
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


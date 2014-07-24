/**********************************************************
 * A visualization of the call-by-value y combinator, a way
 * of implementing recursion in languages with only anonymous
 * functions or (equivalently) without direct self-reference.
 * Fixed-point combinators are only well-typed in languages that
 * support recursive types. As such, for example, the simply
 * typed lambda calculus cannot support a fixed-point combinator
 * and as such is not Turing-complete.
 * 
 * Note: this is merely a demonstration of concept; this
 * visualization is currently very limited in scope.
 * 
 * TODO:
 *     • Find way to import Jison into here to allow users to 
 *       input own expressions to be reduced
 *     • Highlight components of reduction to make reduction 
 *       clearer
 *     • Animate reduction to make it even clearer what's going
 *       on
 *     • Other fancy features
 ***********************************************************/


var Expression = function() {
    
};

var FunctionExpression = function(parameter, expression) {
    this.parameter = parameter;
    this.expression = expression;

    this.takesParameters = function() {
        return true;
    }

    this.toString = function() {
        return "(\\" + this.parameter + " . " + this.expression.toString() + ")";
    };
    
    this.reduce = function() {
        return new FunctionExpression(parameter, this.expression.reduce());
    };
    
    this.applyArgument = function(argumentExpression) {
        return this.expression.replaceVariables(this.parameter, argumentExpression);
    };

    this.replaceVariables = function(variable, replacement) {
        return new FunctionExpression(this.parameter, this.expression.replaceVariables(variable, replacement));
    };
    
    this.prototype = Expression;
};

var ApplicationExpression = function(functionExpression, argumentExpression) {
    this.functionExpression = functionExpression;
    this.argumentExpression = argumentExpression;
    
    this.takesParameters = function() {
        return false;
    }

    this.toString = function() {
        return "(" + this.functionExpression.toString() + " " + this.argumentExpression.toString() + ")";
    };
    
    this.prototype = Expression;
    
    this.reduce = function() {
        if (this.functionExpression.takesParameters()) {
            return this.functionExpression.applyArgument(this.argumentExpression.reduce());
        } else {
            return new ApplicationExpression(this.functionExpression.reduce(), this.argumentExpression.reduce());
        }
    };

    this.replaceVariables = function(variable, replacement) {
        return new ApplicationExpression(this.functionExpression.replaceVariables(variable, replacement), this.argumentExpression.replaceVariables(variable, replacement));
    };
};

var ParameterExpression = function(name) {
    this.name = name;
    
    this.takesParameters = function() {
        return false;
    }

    this.toString = function() {
        return this.name.toString();
    };
    
    this.reduce = function() {
        return this;
    };
    
    this.replaceVariables = function(toRepl, replacement) {
        return null; // shouldn't get called
    };

    this.applyArgument = function(argumentExpression) {
        return null; // shouldn't get called
    };
    
    this.prototype = Expression;
};

var VariableExpression = function(variable) {
    this.variable = variable;
    
    this.takesParameters = function() {
        return false;
    }

    this.toString = function() {
        return this.variable.toString();
    };
    
    this.reduce = function() {
        return this;
    };
    
    this.replaceVariables = function(toReplace, replacement) {
        if (this.toString() === toReplace.toString()) {
            return replacement;
        } else {
            return this;
        }
    };

    this.applyArgument = function(argumentExpression) {
        return new ApplicationExpression(this, argumentExpression);
    };
    
    this.prototype = Expression;
};

var g = new FunctionExpression(
    new ParameterExpression("x"),
    new ApplicationExpression(
        new VariableExpression("f"),
        new ApplicationExpression(
            new VariableExpression("x"),
            new VariableExpression("x")
        )
    )
);

var y = new FunctionExpression(
    new ParameterExpression("f"),
    new ApplicationExpression(g, g)
);

var yf = new ApplicationExpression(y, new VariableExpression("f"));

var _reduce = function() {
    var input = document.getElementById("input").value
    var parsed_input = parser.parse(input);
    return parsed_input.reduce().toString();
}

var _appendToOutput = function(str) {
    document.getElementById("output").innerHTML += "<br>" + str;
}

var _setOutput = function(str) {
    document.getElementById("output").innerHTML = str;
}

var _setInput = function(str) {
    document.getElementById("input").value = str;
}

var setInputAndOutputFromDropdown = function() {
    _setInput(document.getElementById("dropdown").value);
    _setOutput(document.getElementById("dropdown").value);
}

var clear_output = function() {
     _setOutput("");
}

var reduce_in_place = function() {
    var reduction = _reduce();
    _appendToOutput(reduction);
    _setInput(reduction);
}

var reduce = function() {
    _appendToOutput(_reduce());
}

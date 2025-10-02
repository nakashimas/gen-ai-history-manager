Program
  = _ statements:(Statement (_ Statement)*) {
      return [statements[0], ...statements.slice(1).map(s => s[1])];
    }

Statement
  = Pipeline

Pipeline
  = head:Expression tail:(_ "|" _ Expression)* {
      return [head, ...tail.map(t => t[3])];
    }

Expression
  = FunctionDef
  / FunctionCall
  / StringLiteral
  / NumberLiteral
  / BooleanLiteral
  / ArrayLiteral

FunctionDef
  = "func:" _ name:Identifier _ "(" _? body:Pipeline _? ")" {
      return { type: "FunctionDef", name, body };
    }

FunctionCall
  = name:Identifier _ "(" args:ArgList? ")" {
      return { type: "Call", callee: name, args: args || [] };
    }

ArgList
  = head:Expression tail:(_ "," _ Expression)* {
      return [head, ...tail.map(t => t[3])];
    }

StringLiteral
  = "\"" chars:[^\"]* "\"" {
      return { type: "StringLiteral", value: chars.join("") };
    }

NumberLiteral
  = digits:[0-9]+ {
      return { type: "NumberLiteral", value: parseInt(digits.join(""), 10) };
    }

BooleanLiteral
  = "true" { return { type: "BooleanLiteral", value: true }; }
  / "false" { return { type: "BooleanLiteral", value: false }; }

ArrayLiteral
  = "[" _ elements:ElementList? _ "]" {
      return { type: "ArrayLiteral", elements: elements || [] };
    }

ElementList
  = head:Expression tail:(_ "," _ Expression)* {
      return [head, ...tail.map(t => t[3])];
    }

Identifier
  = $([a-zA-Z_][a-zA-Z0-9_]*)

_ = [ \t\n\r]*

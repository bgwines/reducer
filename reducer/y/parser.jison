/* Lambda calculus grammar by Zach Carter */

%lex
%%

\s*\n\s*  {/* ignore */}
"("       { return '('; }
")"       { return ')'; }
"\\"      { return 'LAMBDA'; }
\s?"."\s?    { return '.'; }
[a-zA-Z]  { return 'VAR'; }
\s+       { return 'SEP'; }
<<EOF>>   { return 'EOF'; }
/lex


%right LAMBDA
%left SEP

%%

file
  : expr EOF
    { return $expr; }
  ;

expr
  : LAMBDA var '.' expr
    %{
      $$ = new FunctionExpression($var, $expr)
    %}
  | expr SEP expr
    { $$ = new ApplicationExpression($expr1, $expr2); }
  | var
    { $$ = new VariableExpression($var); }
  | '(' expr ')'
    { $$ = $expr; }
  ;

var
  : VAR
    { $$ = yytext; }
  ;

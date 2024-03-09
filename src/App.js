import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import logo from './logo.svg';
import './styles.css';

import React, {useReducer} from 'react';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  DELETE_DIGIT: 'delete-digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

const reducer = (state, {type, payload}) => {
    switch(type) {
      case ACTIONS.ADD_DIGIT:
        if(state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: payload.digit
          }
        }
        if(state.currentOperand === '0' && payload.digit === '0') return state;
        if((state.currentOperand || '').includes('.') && payload.digit === '.') return state;
        return {
          ...state,
          currentOperand: `${state.currentOperand || ''}${payload.digit}`
        }
      case ACTIONS.CLEAR:
        return {}
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperand == null && state.previousOperand == null)
          return state;
        if(state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }
        if(state.previousOperand == null) {
          return {
            ...state,
            previousOperand: state.currentOperand,
            operation: payload.operation,
            currentOperand: null
          }
        }
        return {
          ...state,
          previousOperand: evaluate(state),
          currentOperand: null,
          operation: payload.operation
        }
      case ACTIONS.EVALUATE:
        if(state.previousOperand == null || state.currentOperand == null || state.operation == null)
          return state;
        return {
          ...state,
          previousOperand: null,
          currentOperand: evaluate(state),
          operation: null,
          overwrite: true
        }
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite) return '';
        if(state.currentOperand == null) return state;
        if(state.currentOperand.length == 1) 
          return {
            ...state,
            currentOperand: null
          }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
    }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  let prev = parseFloat(previousOperand);
  let current = parseFloat(currentOperand);
  let result = "";
  
  if(isNaN(prev) || isNaN(current)) return '';

  switch(operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '/':
      result = prev / current;
      break;
    case '*':
      result = prev * current;
      break;
  }
  return result.toString()
}

const INTEGER_FORMATTER = Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0
});

function formatNum(num) {
    if(num == null) return;
    const [integer, decimal] = num.split('.');
    if(decimal == null)
      return INTEGER_FORMATTER.format(integer);
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatNum(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatNum(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={ ()=> dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={ ()=> { dispatch( { type: ACTIONS.DELETE_DIGIT })} }>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={ ()=> dispatch({ type: ACTIONS.EVALUATE }) }>=</button>     
    </div>
  );
}

export default App;

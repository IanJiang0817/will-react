(() => {
  function anElement(element, children) {
    if (typeof element === 'function') {
        return element();
    }
    else {
        const anElement = document.createElement(element);
        anElement.innerHTML = children.join(' ');
        return anElement;
    }
  }

  function createElement(el, props, ...children) {
    return anElement(el, children);
  }

  window.React = {
    createElement
  };
  window.ReactDOM = {
    render: (el, domEl) => {
      domEl.appendChild(el);
    }
  };
})();


// const Hello = function () {
//     return React.createElement('div', null, `Hello World`);
// };
// const helloWorld = React.createElement(Hello, null, null);
// ReactDOM.render(helloWorld, document.getElementById('root'));

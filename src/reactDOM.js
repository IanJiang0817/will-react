import { isClass, isFunc, isEvent, isClassName, mapProps, ComponentLifecycle} from './react-utils.js';

let mountIndex = 0;

function render(Vnode, container, isUpdate) {  // NOTE: 2 kinds of Vnode
    // mountIndex++;
    // Vnode._mountIndex = mountIndex;

    if (!Vnode) return;
    let { type, props } = Vnode;
    if (!type) return;
    let { children } = props; // children is always an array, even []

    const VnodeType = typeof type;
    let domNode;
    let VnodeTop;
    if(VnodeType === 'function') {
        VnodeTop = renderComponent(Vnode, container);
        if (Vnode._instance.componentWillMount) {
            Vnode._instance.componentWillMount();
        }

        type = VnodeTop.type;
        props = VnodeTop.props;
        children = props.children;
        domNode = document.createElement(type);
        // call componentDidMount here?
        // refactor this function to better call lifecycle func
        if(isUpdate) {
            container.removeChild(Vnode._hostNode);
        }
        VnodeTop._hostNode = domNode; // for tracing back
    }
    else if(VnodeType === 'string') {
        domNode = document.createElement(type);
        if(isUpdate) {
            container.removeChild(Vnode._hostNode);
        }
        Vnode._hostNode = domNode;
    }

    for(let i=0; i<children.length; i++){
        mountChildren(children[i], domNode);  // NOTE: recusion!
    }
    mapProps(domNode, props);

    // NOTE???


    container.appendChild(domNode);

    if (VnodeType === 'function' && Vnode._instance.componentDidMount) {
        Vnode._instance.lifecycle = ComponentLifecycle.MOUNTING;
        Vnode._instance.componentDidMount();
        Vnode._instance.componentDidMount = null; // in order to call only once??
        Vnode._instance.lifecycle = ComponentLifecycle.MOUNT;
    }

    // NOTE????
    return domNode;//注意这里我们加了一行代码，我们要将我们生成的真实节点返回出去，作为其他函数调用的时候的父亲节点
}

function mountChildren(child, domNode) {
    // check children's type, if string, not Vnode, return
    if(typeof(child) === 'string') {
        domNode.innerHTML += child;
        return;
    }

    render(child, domNode);
}

function renderComponent(VnodeWrapper, parentElem) {  //
    const ComponentClass = VnodeWrapper.type;
    const { props } = VnodeWrapper;
    const instance = new ComponentClass(props);
    const unwrappedVnode = instance.render();  // generate Vnodes(like a tree) in class's render()

    VnodeWrapper._instance = instance;
    instance.Vnode = unwrappedVnode; // store Vnode into the instance for recording
    instance.parentElem = parentElem; // store parent dom node for use

    return unwrappedVnode;
}

export default {
    render,
}

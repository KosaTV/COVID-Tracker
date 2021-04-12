class ListedInput {
    constructor(input,listItems,options){
        this.cover = document.createElement("div");
        this.input = input;
        this.parent = input.parentElement;
        this.items = listItems;
        this.list = document.createElement("ul");
        const defaultOptions = {
            showOnStart: false,
            function: null,
            arguments: []
        };
        this.options = Object.assign(defaultOptions,options);
        this.styling();
        this.show();
    }

    styling(){
        this.cover.classList.add("cover");
        this.list.classList.add("input-list");
        this.cover.classList.add("cover--listed");
        this.parent.insertBefore(this.cover,this.input);
        this.cover.appendChild(this.input);
        this.cover.appendChild(this.list);
        this.addingElements()
    }

    addingElements(){
        let code = null;
        this.list.innerHTML = "";
        this.items.forEach(item=>{
            const li = document.createElement("li");
            li.textContent = item[0];
            li.classList.add("input-list__item");
            this.list.appendChild(li);
        });
        if(this.items.length === 1) this.input.dataset.code = code;
    }

    show(){
            async function ShowWhileTyping(fn,args){
                this.items = await fn(...args);
                this.addingElements();
                if(this.input.value.length){
                    this.list.classList.add("input-list--show");
                    this.input.classList.add("input--typed");
                } else{
                    if(!this.options.showOnStart){
                        this.list.classList.remove("input-list--show");
                        this.input.classList.remove("input--typed");
                    }
                }
            }
            this.input.addEventListener("focus",e=>{
            e.preventDefault();
            if(this.options.showOnStart){
                this.list.classList.add("input-list--show");
                this.input.classList.add("input--typed");
            }
            this.input.addEventListener("input",ShowWhileTyping.bind(this, this.options.function,this.options.arguments));
            });

            this.input.addEventListener("blur",e=>{
                this.list.classList.remove("input-list--show");
                this.input.classList.remove("input--typed");
                this.input.removeEventListener("input",ShowWhileTyping.bind(this, this.options.function,this.options.arguments));
            });

            this.list.addEventListener("mousedown",e=>{
                if(e.target.closest(".input-list__item")){
                    const item = e.target.closest(".input-list__item");
                    this.input.value = item.textContent;
                }
            });
    }
}
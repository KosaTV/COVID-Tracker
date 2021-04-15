class ListedInput {
    constructor(input,listItems,options){
        this.cover = document.createElement("div");
        this.input = input;
        this.button = input.nextElementSibling;
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
        this.addingElements();
    }

    addingElements(){
        let code = null;
        this.list.innerHTML = "";
        if(this.items){
            this.items.forEach(item=>{
            const li = document.createElement("li");
            li.textContent = item;
            li.classList.add("input-list__item");
            this.list.appendChild(li);
        });
        }
    }

    debuonce(fn, delay){
        let timer;
        return function(){
            clearTimeout(timer);
            timer = setTimeout(fn,delay);
        }
    }

    show(){
            const items = [...this.list.children];

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
            this.input.addEventListener("input",this.debuonce(ShowWhileTyping.bind(this, this.options.function,this.options.arguments),250));
            });

            this.input.addEventListener("blur",e=>{
                this.list.classList.remove("input-list--show");
                this.input.classList.remove("input--typed");
                this.input.removeEventListener("input",this.debuonce(ShowWhileTyping.bind(this, this.options.function,this.options.arguments),250));
            });

            this.list.addEventListener("mousedown",e=>{
                if(e.target.closest(".input-list__item")){
                    const item = e.target.closest(".input-list__item");
                    this.input.value = item.textContent;
                }
            });

            this.input.addEventListener("keydown",e=>{
                let currentItem = items.find(item=>item.classList.contains("input-list__item--active"));
                if(e.key === "ArrowDown"){
                    if(currentItem){
                        currentItem.classList.remove("input-list__item--active");
                        if(currentItem.nextElementSibling){
                            currentItem = currentItem.nextElementSibling;
                        } else{
                            currentItem = items[0];
                        }
                    } else{
                        currentItem = items[0];
                    }
                    currentItem.classList.add("input-list__item--active");
                    this.input.value = currentItem.textContent;
                    const index = items.findIndex(item=>item.classList.contains("input-list__item--active"));
                    if(index > 4){
                        const y = this.list.scrollTop;
                        let height = getComputedStyle(currentItem).getPropertyValue("height");
                        height = +height.substr(0,height.length-2);
                        this.list.scroll(0, y+height+.69439);
                    }
                } else if(e.key === "ArrowUp"){
                    if(currentItem){
                        currentItem.classList.remove("input-list__item--active");
                        if(currentItem.previousElementSibling){
                            currentItem = currentItem.previousElementSibling;
                        } else{
                            currentItem = items[this.items.length-1];
                        }
                    } else{
                        currentItem = items[this.items.length-1];
                    }
                    currentItem.classList.add("input-list__item--active");
                    this.input.value = currentItem.textContent;
                }

                if(e.key === "Enter"){
                    this.button.click();
                    this.input.blur();
                }
            });

            this.list.addEventListener("mouseover",e=>{
                if(e.target.closest(".input-list__item")){
                    items.forEach(item=>item.classList.remove("input-list__item--active"));
                    e.target.classList.add("input-list__item--active");
                }
            });
    }
}
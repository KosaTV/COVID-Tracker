class ListedInput {
    constructor(input,listItems,options){
        this.cover = document.createElement("div");
        this.input = input;
        this.parent = input.parentElement;
        this.items = listItems;
        this.list = document.createElement("ul");
        const defaultOptions = {
            showOnStart: false
        };
        this.options = Object.assign(defaultOptions,options);
        this.styling();
        this.show();
    }

    styling(){
        this.cover.classList.add("cover");
        this.list.classList.add("input-list");
        this.cover.classList.add("cover--listed");
        this.items.forEach(item=>{
            const li = document.createElement("li");
            li.textContent = item;
            li.classList.add("input-list__item");
            this.list.appendChild(li);
        });
        this.parent.insertBefore(this.cover,this.input);
        this.cover.appendChild(this.input);
        this.cover.appendChild(this.list);
    }

    show(){
        
            this.input.addEventListener("focus",e=>{
            e.preventDefault();
            if(this.options.showOnStart){
                this.list.classList.add("input-list--show");
                this.input.classList.add("input--typed");
            }
            });

            this.input.addEventListener("blur",e=>{
                this.list.classList.remove("input-list--show");
                this.input.classList.remove("input--typed");
            });

            this.input.addEventListener("input",e=>{
            if(this.input.value.length){
                this.list.classList.add("input-list--show") 
                this.input.classList.add("input--typed");
            } else{
                this.list.classList.remove("input-list--show");
                this.input.classList.remove("input--typed");
            }
        });
    }
}

const input = document.querySelector(".input-cnt__field");
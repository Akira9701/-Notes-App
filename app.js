function bigNote(){
    let  notesCounter = 0;
    let flag = "none";
    const notesWrap = document.querySelector('.notes-zone_notes-chose');
    const pageMake = document.querySelector('.notes-zone_add-note-container');
    const btnClose = document.querySelector('.notes-zone_add-note-close-wrap');
    const titleSide = document.querySelector('.notes-zone_add-note-title');
    const textSide = document.querySelector('.notes-zone_add-note-textarea');
    const btnOpen = document.querySelector('.notes-zone_add-note');
    class Note{
        constructor(title,text,key){
            this.key = key;
            this.title = title;
            this.text = text;
            this.shortText = (this.text.length > 35) ? (this.text).substr(0, 35) + "..." : this.text;
            this.element;
            this.removeBtn;
        }
        setElem(){
            this.element = document.querySelector(`div[data-name='${this.title}']`);
        }
        removeNote(){
            const removeBtn = this.element.querySelector('.notes-zone_note-close-btn');
            removeBtn.addEventListener('click', ()=>{
                this.element.remove();
                localStorage.removeItem(`note_${this.key}`);
            })
        }
        rewriteNote(){
            this.element.addEventListener('click',(e)=>{
                flag = "rewrite";
                console.log(flag);
                if(!e.target.classList.contains('notes-zone_note-close-btn') && !e.target.classList.contains('removeNote')){
                    
                    titleSide.value = this.title;
                    textSide.value = this.text;
                    pageMake.classList.add('active-note');
                        

                        btnClose.addEventListener('click', () =>{
                            if(flag === "rewrite"){
                                this.title = titleSide.value
                                this.text = textSide.value;
                                this.shortText = (this.text.length > 35) ? (this.text).substr(0, 35) + "..." : this.text;
                                this.element.querySelector('.notes-zone_note-title').innerHTML = this.title;
                                this.element.querySelector('.notes-zone_note-desc').innerHTML = this.shortText;
                                localStorage.setItem(`note_${this.key}`, JSON.stringify(this));

                                pageMake.classList.remove('active-note');
                                titleSide.value = "";
                                textSide.value = "";
                                flag = 'none';
                                console.log('я объект');
                            }
                        }) 
                    
                }
            })
        }
        setOptionsNote(){
            this.setElem();
            this.removeNote();
            this.rewriteNote();
        }
    }

    function addNoteOnPage(note){
            console.log(note)
            let element = `     <div class="notes-zone_note" data-name="${note.title}">
            <p class="notes-zone_note-title">${note.title}</p>
            <p class="notes-zone_note-desc">${note.shortText}</p>
            <div class="notes-zone_note-close-block">
                <div class="notes-zone_note-close-col">
                    <div class="notes-zone_note-close-btn"> 
                                <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-x removeNote" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>`;
            notesWrap.insertAdjacentHTML('afterbegin', element);
            note.setOptionsNote();
            titleSide.value = "";
            textSide.value = "";
            
            notesCounter+=1;
        

    }

    function randomKey(count){
        let key = "";
        for (let i = 0; i < count; i++) {
            key+=String(Math.floor(Math.random() * 9));
            
        }
        
        return key;
    }

    function GetAndSetNotes(){
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); 
            const noteObject = JSON.parse(localStorage.getItem(`${key}`));    
            let note = new Note(noteObject.title, noteObject.text, noteObject.key);
            addNoteOnPage(note);

        }
    }

    function getWeather(city){
        const weatherBlock = document.querySelector(".weather-zone_weather-block");
        const tempSide = document.querySelector('.weather-zone_degree');
        const windSide = document.querySelector('.weather-zone_max span');
        const citySide = document.querySelector('.weather-zone_city');
        const timeSide = document.querySelector('.weather-zone_time');
        
        const key = '4c49730b0f4643fb953210301221712';
        const hours = (new Date()).getHours();
        let temp = "";
        let wind = "";
        fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&lang=ru
        `)
        .then(response => response.json())
        .then(result => {
            temp = String(result.current.feelslike_c).split('.')[0];
            wind = result.current.wind_kph;
            citySide.innerHTML = city;
            tempSide.innerHTML = temp + '°';
            windSide.innerHTML = wind + ' км/ч';
            console.log(hours);
            if(hours < 17 && hours > 6){
                weatherBlock.classList.remove('night-mode');
                weatherBlock.classList.add('day-mode');

            }else{
                weatherBlock.classList.remove('day-mode');
                weatherBlock.classList.add('night-mode');
            }

            return temp;
        });
    
        
    }

    function getDay(){
        const daySideName = document.querySelector('.weather-zone_date-name');
        const daySideVar = document.querySelector('.weather-zone_date-var');
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        date = new Date();
        daySideName.innerHTML = days[date.getDay()];
        daySideVar.innerHTML = date.getDate();

        
    }

    function newNote(){
        btnOpen.addEventListener('click', ()=>{
            pageMake.classList.add('active-note');
            flag = "add";
        })
        btnClose.addEventListener('click',()=>{
                console.log(flag)

                if(flag === "add"){
                    if(textSide.value !== "" && titleSide.value !== ""){
                        const note = new Note(titleSide.value, textSide.value, `${randomKey(12)}`);
                        localStorage.setItem(`note_${note.key}`, JSON.stringify(note));
                        notesCounter+=1;
                        pageMake.classList.remove('active-note');
                        addNoteOnPage(note);
                        flag = 'none';
                    }else{
                        pageMake.classList.remove('active-note');

                    }
                }
        });
    }
    GetAndSetNotes();
    getWeather('Moscow');
    getDay();
    newNote();

}
bigNote();

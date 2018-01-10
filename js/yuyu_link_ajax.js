/**
 * 	Author     : Lipinski Yury
 * 	E-mail     : lipinski.yury@gmail.com
 *  Created on : 18.12.2017
 */

/**
 *  АСИНХРОННОЕ ПОЛУЧЕНИЕ КОНТЕНТА ПРИ КЛИКЕ НА ССЫЛКУ 
 * ------------------------------------------------------------------------------
 * 
 *   Ссылка. Пример:
 *   	 <a class="... yuyu-link-ajax" 	
 *        data-event="click"	
 *        data-content="?ajax=form-message-user"  
 *        data-result = "result_reports" data-spinner="fa-spinner"
 *        >Текст ссылки</a> 
 *
 * 	Описание атрибутов ссылки:
 * 
 *  	class="... yuyu-link-ajax"   - данный класс идентифицирует ссылку для отправки ajax запроса;		
 *  	data-event  - события: 
 *           -  "click" ajax запрос срабатывает при клике на элемент;                   
 *           -  "mouseover" ajax запрос срабатывает при наведении на элемент курсора мыши;    
 *           -  "focus" ajax запрос срабатывает при установке фокуса на элементе формы .Ссылка должна быть элементом формы;                 
 *           -  "change" ajax запрос срабатывает при Изменение значения любого элемента формы. Для текстовых элементов срабатывает при потере фокуса .Ссылка должна быть элементом формы;                   
 *  		 -  "input" ajax запрос срабатывает при Изменение значения текстовых элементов формы.Ссылка должна быть элементом формы;   	 			
 *           -  "submit" ajax запрос срабатывает при отправке формы. Ссылка должна быть элементом формы; 
 *      data-content - адрес контроллера, который обрабатывает запрос и отправляет ответ;
 *      data-json - содержит строку с передаваемыми данными в форме json data-json='{"ключ1":"значение1","ключ2":"значение2"}'
 *      data-warning  - выводит пердупреждение перед отправкой запроса на сервер;
 *      data-result - содержит id элемента куда будет вставлен ответ с сервера;
 *      data-reload - перезагрузка страницы, после ответа сервера;
 *          - если close - все события, кроме "submit";             
 *          - если submit - при получении ответа сервера, после отправки формы;           
 *      data-spinner - прелоадер. Использует библиотеку Font Awesome:      
 *           -  "fa-spinner fa-3x";
 *           -  "fa-circle-o-notch";
 *           -  "fa-refresh";
 *           -  "fa-cog";
 *           -  "fa-spinner fa-pulse";
 *           
 *       ,где класс fa-3x задает размер спиннера (fa-lg, fa-2x, fa-3x, fa-4x, fa-5x);
 *
 * Важно! в форме прописать onsubmit="return false;" <form ... onsubmit="return false;" ><form>
 *  ------------------------------------------------------------------------------
 *
 *	Если в консоле ошибка типа "SyntaxError: Unexpected token # in JSON at position 0" - неправильный синтаксис 
 *	атрибута data-options . Должно быть data-options='{"":"","":""}'
 *		
 *			
 */

 (function () {

    var 
    objWidjet;

    function Widget() {
        objWidjet = this;
        
        this.links = [];
        this.countEvent=0;
        this.elemStyle;

        this.config = {
            classNameBtn: 'yuyu-link-ajax',
        };

        this.init();

    }
    
    Widget.prototype.init = function (elem) {
        this.links = document.getElementsByClassName(this.config.classNameBtn);
        this.listener();
    }

    Widget.prototype.listener = function () {
        var
        length = this.links.length,
        i;

        for (i = 0; i < length; i++) {       
            this.toggle(this.links[i]);    
        }
    }

    Widget.prototype.toggle = function (elemBtn) {
        var 
        _this=this;

        switch (elemBtn.dataset.event) {
            case 'click':
            elemBtn.addEventListener('click',function(){        
                _this.showContent(this,false);
            });
            break;     

            case 'mouseover':
            elemBtn.addEventListener('mouseover',function(){
                _this.showContent(this,false);
            });
            break;

            case 'focus':
            elemBtn.addEventListener('focus',function(){
                _this.showContent(this,true);
            });
            break;

            case 'change':
            elemBtn.addEventListener('change',function(){
                _this.showContent(this,true);
            });
            break;

            case 'input':
            elemBtn.addEventListener('input',function(){
                _this.showContent(this,true);
            });
            break;


            case 'submit':
            elemBtn.addEventListener('click',function(){
                _this.showContentSubmit(this);
            });
            break;


            default:
            break;
        }
    }

    Widget.prototype.showContent = function (elemBtn, isValue) {

        var 
        value=false,
        resultElem,
        _this = this;        

        if(elemBtn.dataset.warning){
           if(!confirm(elemBtn.dataset.warning)){
            return;
        }
    }
    resultElem=document.getElementById(elemBtn.dataset.result);

    if(resultElem){
      if(elemBtn.dataset.spinner){
       resultElem.innerHTML = '<div style="width:100%;text-align:center" >'+
       '<span class="fa '+ elemBtn.dataset.spinner +' fa-spin fa-fw" style="margin:10px;color:#ccc;"></span>'+
       '</div>';
   }else{
    resultElem.style.opacity = '0'; 
}  
}


if (elemBtn.dataset.content) {

    if(elemBtn.dataset.json){
        value=elemBtn.dataset.json;                
    }else if(isValue){
        value = elemBtn.value;
    }else{
       value = elemBtn.innerText;
   }


   if(this.countEvent<1){

       this.sendPost(elemBtn.dataset.content, false,value, function (error, result) {   

        _this.countEvent++;
        
        if(error){
            console.dir(error); 
        }

        if(elemBtn.dataset.reload=='close'){
            location.reload(true); 
        }else{
          resultElem.innerHTML=result;   
          resultElem.style.transition = 'opacity 0.3s';  
          resultElem.style.opacity = '1';

          if(_this.countEvent==1){   
            new Widget();  
        } 
    }

});
   }


}
}

Widget.prototype.showContentSubmit = function (elemBtn) {

    var
    url, 
    value,
    resultElem,
    _this = this;

    if(elemBtn.dataset.warning){
       if(!confirm(elemBtn.dataset.warning)){
        return;
    }
}

if (elemBtn.dataset.content) {
    url = elemBtn.dataset.content;
}else{
    url = elemBtn.form.action;
}

resultElem=document.getElementById(elemBtn.dataset.result);

if(elemBtn.dataset.spinner){
   resultElem.innerHTML = '<div style="width:100%;text-align:center" >'+
   '<span class="fa '+ elemBtn.dataset.spinner +' fa-spin fa-fw" style="margin:20px;color:#ccc;"></span>'+
   '</div>';
}else{
    resultElem.style.opacity = '0'; 
}

if(url && this.countEvent<1){
    value = elemBtn.value;
    this.sendPost(url, elemBtn.form, false, function (error, result) { 

        if(error){
         console.dir(error); 
     }

     if(elemBtn.dataset.reload=='submit'){
        location.reload(true); 
    }else{
        resultElem.innerHTML=result;   
        resultElem.style.transition = 'opacity 0.3s';  
        resultElem.style.opacity = '1';     

        if(_this.countEvent==1){   
            new Widget();  
        }
    }              

});
}
}

Widget.prototype.sendPost = function (url, form, value, callback) {

    var
    
    xhr = new XMLHttpRequest(),
    f = form || document.createElement('form'),
    formData = new FormData(f);

    if(value){
        formData.append("value", value);
    }

    xhr.timeout = 5000;
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {

            if (xhr.status === 200) {
                callback(null, xhr.response)
            } else {
                callback(xhr.status, null)
            }
        }
    }
    xhr.ontimeout = function () {
        console.log('Timeout');
    }

    xhr.open("POST", url);
        // xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.send(formData);

    };

    objWidjet = new Widget(); 





})();


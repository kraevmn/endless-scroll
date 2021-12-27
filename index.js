function throttle(callee, timeout) {
    // Таймер будет определять,
    // надо ли нам пропускать текущий вызов.
    let timer = null;
  
    // Как результат возвращаем другую функцию.
    // Это нужно, чтобы мы могли не менять другие части кода,
    // чуть позже мы увидим, как это помогает.
    return function perform(...args) {
      // Если таймер есть, то функция уже была вызвана,
      // и значит новый вызов следует пропустить.
      if (timer) return;
  
      // Если таймера нет, значит мы можем вызвать функцию:
      timer = setTimeout(() => {
        // Аргументы передаём неизменными в функцию-аргумент:
        callee(...args);
  
        // По окончании очищаем таймер:
        clearTimeout(timer);
        timer = null;
      }, timeout);
    };
  }

function getPosts(url) {
    fetch(url)
        .then((response) => response.json())
        .then((json) => viewPosts(json))
        .catch(function(error) {
            console.log('request failed', error)
        });
}

let count = 0;
getPosts('https://jsonplaceholder.typicode.com/posts');

function viewPosts(json) {
    const posts = document.querySelector('.posts');
    posts.insertAdjacentHTML('beforeEnd', `<div class=posts-page data-url='https://jsonplaceholder.typicode.com/posts/${count}'></div>`);
    (Array.from(json)).forEach(el => {
        let {userId, id, title, body} = el;
        posts.insertAdjacentHTML('beforeEnd', `
            <div>${userId}</div>
            <div>${id}</div>
            <div>${title}</div>
            <div>${body}</div>
            <div>------------------------------------------------------------------------------------------</div>
        `);
    })
    
    posts.insertAdjacentHTML('beforeEnd', 
    `
        <div class="posts-new">
            Давай еще подгрузим
            <script type="text/javascript">
                alert("This alert box was called with the onload event");
            </script>
        </div>
    `);
    let arr = document.getElementsByTagName('script')
    for (let n = 0; n < arr.length; n++)
        eval(arr[n].innerHTML)//run script inside div

}

function offsetPosition(element) {
    let offsetTop = 0;
    do {
        offsetTop  += element.offsetTop;
    } while (element = element.offsetParent);
    return offsetTop;
}


window.addEventListener("scroll", throttle(function(){
    console.clear();
    let postsNew = document.querySelector('.posts-new');
    let postsPage = document.querySelectorAll('.posts-page');
    let postsPageOffset = {};
    if (postsPage) {
        postsPage.forEach(el => {
            if (Object.keys(postsPageOffset).length == 0) postsPageOffset['0'] = el.dataset.url;
            else postsPageOffset[String(offsetPosition(el))] = el.dataset.url;
        })
    }
    let urlPage = '';
    for (key in postsPageOffset) {
            console.log(key,' = ',postsPageOffset[key]);
            if (Number(key)<=window.pageYOffset) urlPage = postsPageOffset[key];
        }
    
    console.log('Мы сейчас смотрим страницу =',urlPage);
    window.history.pushState(null, null, 'http://127.0.0.1:5500/index.html?'+urlPage);

    if (postsNew) {
        let postsNewOffset = offsetPosition(postsNew);
        console.log('Расстояние до элемента подгрузки=',postsNewOffset)
        let yOffset       = window.pageYOffset;
        console.log('Прокручено от верха окна=',yOffset)
        let window_height = window.innerHeight;
        let y             = yOffset + window_height;
   
        // если пользователь почти достиг конца
        if(y >= postsNewOffset-300)
        {
            postsNew.parentNode.removeChild(postsNew); //Удаляем Загрузить новые, чтобы получить новый блок с новой ссылкой
            count += 1;
            getPosts('https://jsonplaceholder.typicode.com/posts');
        }
    }
    
},200));
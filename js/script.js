function loadData(e){
    console.log(e.target.parentNode)
    if(document.querySelector('.sidebar-nav li.active')){
        document.querySelector('.sidebar-nav li.active').classList.remove('active');
    }
    e.target.closest('li').classList.add('active');
}
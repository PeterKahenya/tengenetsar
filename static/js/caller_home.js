var start_call_button = document.getElementById("start_call_button")
var close_chooose_expert_btn = document.getElementById("close_chooose_expert_btn")

var choose_expert_page = document.getElementById("choose_expert_page")
var main_page = document.getElementById("main_page")

close_chooose_expert_btn.onclick=(e)=>{
    choose_expert_page.style.display="none"
    main_page.style.display="block"
}

start_call_button.onclick=(e)=>{
    main_page.style.display="none"
    choose_expert_page.style.display="block"
}
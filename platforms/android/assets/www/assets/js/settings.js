$("#url").val(localStorage.getItem('phenobook_url'));
$("#save-btn").click(function(){
    localStorage.setItem('phenobook_url', $("#url").val());
    window.location.href = "../index.html";
});
$("#cancel-btn").click(function(){
    window.location.href = "../index.html";
});

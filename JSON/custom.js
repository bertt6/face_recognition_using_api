var data = fetch("veri.json")
.then(response=>response.json())
.then(veri=>{
     console.log(veri);
     console.log(veri.kullanicilar);
     console.log(veri.yetki);
     console.log(veri.yetki[0]);
     var stringData = JSON.stringify(veri);
     console.log();
})
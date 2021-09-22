/**
    Motorun kodunuzu intreprets etmeden önce compile ettiğini hatırlayın. Dolayısıyla fonksiyon ve değişkenlerin deklarasyonlarının ilk olarak proses edildiğini daha sonra execution işlemlerinin yapıldığını düşünmek mantıklıdır.

    ' var a = 2; ' gördüğünüz zaman bunun tek bir ifade olduğunu düşünebilirsiniz. Ancak javascripte göre bu iki ifadedir: 
    1) var a;
    2) a = 2;
    İlk ifade, deklarasyon, compile aşamasındadır. İkinci ifade, atama, execution aşamasındadır. Dolayısıyla şu iki örnek düşünüldüğünde

    
    1)      a = 2;                              var a;
            var a;                      ->      a = 2;
            console.log( a );                   console.log( a );


    2)      console.log( a );                   var a;
            var a = 2;                  ->      console.log( a );
                                                a = 2;

    Dolayısıyla ilk kod hata vermeyecekken ikinci kod ' undefined ' hatası fırlatacaktır.
     
    Burada metaforik olarak deklarasyonların en yukarıya taşındıkları düşünülebilir. Bu da hoisting(kaldırma, yukarıya çekme) ismine sebebiyet verir.

    Fonksiyon deklarasyonları hoisted edilirler ancak fonksiyon expressionları değil;

        foo();                                                     function foo() {
        function foo() {                                               var a;
            console.log( a ); // undefined   ->  hoisted  ->           console.log( a ); //undefined
            var a = 2;                                                 a = 2;
        }                                                          }
                                                                   foo();

    Ancak bu hoisted edilmez;
    
        foo(); // not ReferenceError, but TypeError!

        var foo = function bar() {
         // ...
        };

     Burada ' foo ' hoisted edilir ve programın çevrili scope'una attach edilir. Dolayısıyla oluşan hata ' Reference Error ' değildir. Ancak ' foo ' henüz bir değere sahip değildir( tıpkı gerçek bir fonksiyon deklarasyonunda da olacağı gibi ). Bu yüzden ' foo() ' undefined değeri invoke etmeye çalışıyor bu da illegal operasyon olduğundan ' TypeError ' e sebebiyet veriyor.

    *? Önce Fonksiyonlar 

        Fonksiyonlar variable'lardan daha önce hoist edilirler. 

            foo(); // 1                          function foo() { 
                                                     console.log( 1 );
            var foo;                             }
                                            
            function foo() {                     foo(); // 1
                console.log( 1 );      ->    
            }                                    foo = function() {
                                                         console.log( 2 );
            foo = function() {                   };   
                 console.log( 2 );
            };


 */
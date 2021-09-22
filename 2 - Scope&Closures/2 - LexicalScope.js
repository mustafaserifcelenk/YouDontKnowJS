/**
    *! Lex-time

        Lexical scope değişkenlerin ve blockların sizin tarafınızdan nerede tanımlandığına dayanır ve bu yüzden lexer kodu işlerken yerlerinin değiştirilmesi bir çok durumda mümkün değildir. Dolayısıyla lexical scope lexing zamanında tanımlanan scope'tur denilebilir.
    
        Scope bir değişkeni bir defa bulduğu zaman artık dışardaki katmanlara bakmaz.

        *? Not: 
            
            Global değişkenler aynı zamanda global objenin değişkenleridirler, dolayısıyla onlara ' window.a ' şeklinde ulaşabiliriz. Bu yüzden onlara sadece lexical name'leri haricinde global obje vasıtasıyla da ulaşılabilir.

        Fonksiyonu nerde nasıl invoke ettiğinizin önemi yoktur. Onun lexical scope'u deklare edildiği yerdir. Lexical scope look-up'ı sadece ilk objeye ulaşır. Onun propertilerine erişimi object-property-access rule devralır.

    *! Lexical'ı Aldatma

        *? Eval

            eval(...) fonksiyonu string alır ve o stringin içeriğine sanki o tam o noktada tanımlanmış gibi davranır. Başka deyişle yazılı kodunuz içerisine, programatik olarak, orada tanımlanmış olma işlevini ekleyebilirsiniz. Eval fonksiyonu dinamik olarak oluşturulan kodu çalıştırmak için kullanılır. Strict modda scope dışında oluşturulan stringler reference error'a sebebiyet verecektir.

            function foo(str, a) {
             eval( str ); // cheating!
             console.log( a, b );
            }
            var b = 2;
            foo( "var b = 3;", 1 ); // 1, 3

        *? With

            
    *? Not : 
        Function expression'lar anonim olabilir(bir isme sahip olmayabilirler) ancak funtion deklarasyonları isme sahip olmak zorundadırlar.

    *? Anonim fonksiyonların dezavantajları
        1. Kullanılabilir bir isme sahip olmadıkları için stack traces'da izlenmeleri mümkün değildir, bu yüzden debugging işlemleri zordur.
        2. Recursion gibi kendini refeere etmenin gerekli olduğu durumlarda kullanımdan kaldırılmış olan arguments.callee referansı gereklidir.
        3. İsimler kodun anlaşılırlığını artırır.

               ->   setTimeout( function(){
                        console.log("I waited 1 second!");
                    }, 1000 );

                    Yukarıdaki gibi anonim fonksiyonları isimlendirmek daha iyidir:

               ->   setTimeout( function timeoutHandler(){       // <-- Look, I have a
                                                                  // name!
                        console.log( "I waited 1 second!" );
                    }, 1000 );

        
    *? : IIFE, immediately invoked function:
        
        -> (function foo(){
                var a = 3;
                console.log( a ); // 3
            })();


*/
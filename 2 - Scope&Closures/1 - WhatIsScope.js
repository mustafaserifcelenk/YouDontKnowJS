/**
 * ! Interpreting & Compiling Languages
        
        Bazı dillerin komut çevirileri her program çalıştığında aşağıdan yukarı satır satır yapılır ve buna INTERPRETING denir.
        Bazı diller ise bunu zamanından önce yapar ve buna COMPILING denir. Böylece kod çalışacağı zaman her şey hazır olur.
        
 * ! Scope Kavramı

        Programlama dilinde değişkenlerin nerde tutulduğu ve nasıl onlara ulaşıldığı konularına scope denir.

 * ! Compiler Theory     

        Javascript dynamic veya interpreted diller kategorisinde görülsede aslında bir compiled dildir. Çoğu derlenmiş dilde olduğu gibi önceden derlenmez ya da derlemenin ürünü ayrık sistemlerde kullanılır durumda olmaz. Ancak yine de javascript'te geleneksel derlenmiş dillerde olduğu gibi benzer yolları izler.

        Yazdığınız kodun çalıştırılmasından önce gerçeklerşen derleme aşaması 3 kısımdan oluşur:

        *? 1) Tokenizing / Lexing

            Bir karakter dizisini, belirteç adı verilen anlamlı (dile göre) parçalara(token) bölme. Mesela: 

                var a = 2;

            kod parçacığı şu tokenlara bölünür : var, a, 2, ; (anlamlı olup olmamasına göre white space'lerde buraya dahil olur.)

        *? 2) Parsing

            Tokenların oluşturulan stream(array)'ini alıp programın gramatik yapısını gösteren AST(abstrack syntax tree) adındaki iç içe öğeler ağacına dönüştürme. 

                var a = 2;
            
            kodunun ağacı en üst seviyede child node'u Identifier(whose value is a) olan VariableDeclaration denen node ile veya NumericLiteral(whose value is 2) adlı çocuğa sahip AssignmentExpression çocuğu ile başlayabilir.

        *? 3) Code Generation
        
            AST'nin alınıp çalıştırılabilir koda dönüştürülmesi. Bu kısım dilden dile veya çalıştırılcak platformdan platforma değişebilir.


 * ? Engine : 

        Javascript kodunun compile ve execute edilmesiden sorumlu program. 

 * ? Compiler : 

        Motora parsing ve code üretiminin kirli işlerinde yardım eder.

 * ? Scope :

        Motorun tüm declare edilmiş identifierları(variables) toplamasına, uygulamasına ve bunların erişim kısıtlarına zorlanmasına yardım eden diğer yardımcı.

 * ! Önü - Arkası

        Compiler'ın ` var a = 2; ` koduna baktığında ilk olarak yaptığı kodu lexingle tokenlara ayırarak ağaca parse etmektir. Ancak iş code generationa geldiğinde sıradışı bir davranış görürüz. Normalde düşündüğümüz "hafızada variable için bir yer tut, onu 'a' olarak etiketle, ve içerisine değer olarak 2 ata" işlemleridir. Ancak bu pek doğru değil. Compile bunun yerine şunları yapar:

        1) Compiler scope'a scope collection'ı içinde halihazırda bir 'a' değişkeni olup olmadığını sorar. Eğer varsa compiler declaration'ı ignore eder ve yola devam eder. Diğer durumda ise  compiler scope'a 'a' isimli bir variable için scope collection'da yer açmasını talep eder.

        2) Daha sonrasında compiler engine için 'a=2' atama kodunu yaratır. Engine ilk olarak scope'a 'a' isminde bir değişkenin olup olmadığını sorar. Eğer varsa engine onu kullanır. Yoksa başka yerde arar.

        3) En nihayet engine 'a' değişkenini bulursa ona '2' değerini atar, bulamadıysa da hata fırlatır.


 * ! Compiler Konuşması

        Motor compiler'ın step 2 de ürettiği koda bakarken 'a' nın deklare edilip edilmediğini araştırmak(look-up) zorundadır. Bu araştırmaya scope denir. Ancak bu araştırmanın tipi sonucu da belirler.

        Bizim durumumuzda motor LHS araştırması yapar. Diğer tür RHS'dir. (L : left hand side, R : right hand side)

        * ? console.log( a ); : 

              Bu bir RHS referanstır. Çünkü burada 'a' ya atanan herhangibi bir değer yoktur. Bunun yerine 'a' ya atanan değeri getirmeye çalışırız. Bu anlamda RHS referansı aslında sola atamanın olmadığı manasındadır.

        * ? a = 2; : 

              Bu ise LHS'dır. Çünkü burada mevcut değerin ne olduğuyla ilgilenmeyiz, onun yerine atamayla ilgileniriz.

        * ? Not : 

              LHS ve RHS zorunlu olarak '=' işaretinin solunda ve sağında kalmak ile alakalı değildir. Burada çok farklı atama şekilleri mevcuttur. Bunun yerine daha kapsayıcı bir tanım şudur : LHS -> Atamanın hedefinin ne/kim olduğu, RHS -> atamanın kaynağının ne/kim olduğu.

        * ? Örnek : 

              function foo(a) {
                     console.log( a ) ; 
              }

              foo( 2 );

              Bir işlev çağrısı olarak foo(..) öğesini çağıran son satır, foo'ya bir RHS referansı gerektirir, yani "Git foo değerini araştır ve bana ver." anlamına gelir. Ayrıca (..), foo'nun değerinin execute edilmesi gerektiği anlamına gelir, bu yüzden aslında bir fonksiyon olsa daha iyi olur!

              Burada LHS ataması ise implicit olarak foo(..) foksiyonuna '2' değeri atandığında olur. 

              Console.log'a 'a' değeri atandığında da RHS referans olur. Console.log execution için referansa ihtiyaç duyar. Console objesinin log propertisi için aranması da bir RHS referansıdır.

        * ? Not 2 : 

              ' foo( a ) {... ' fonksiyon deklarasyonunu normal bir variable deklarasyonu ve ataması olarak düşünebilirsiniz( ' var foo ' veya ' foo = function( a ) {.. ' gibi). Bu yüzden fonksiyon deklarasyonunu bir LHS look-up'ı olarak düşünmeye meyilli olabilirsiniz. Ancak buradaki ince fark

              
 * ! Motor & Compiler Konuşması

       ->   function foo(a) {

              console.log( a ); // 2

                     }

              foo( 2 );


       Engine : Hey Scope, ben foo için bir RHS referansına sahibim. Bununla ilgili ne biliyorsun?

       Scope : Evet duydum, compiler bir kaç saniye önce deklare etti. Bir fonksiyon, işte burada.

       Engine : Mükemmel, foo'yu execute ediyorum.

       Engine : Hey Scope, ' a ' için bir LHS referansına sahibim. Bunu hiç duydun mu?

       Scope : Compiler foo için resmi bir parametre deklare etti, işte burada.

       Engine : Teşekkürler, şimdi ' a ' ya 2 ' yi atayalım.   

       Engine : Yine ben Scope. console için RHS look-up'ına ihtiyacım var. Bunu duydun mu?

       Scope : Evet var, yerel bir obje( built-in, yerleşik ).

       Engine : Mükemmel, ' log ' fonksiyonunu arıyorum. İşte burada.

       Engine : Merhaba Scope. ' a ' nın RHS referansı için bana yardım edebilir misin? Değeri hatırlıyorum ama double check yapayım dedim.

       Scope : Tamamdır, değerde bir değişiklik yok, işte burada.

       Engine : Güzel. log(...) içindeki ' a ' ya 2' yi atayalım.     

 * ! Nested Scope

       Scope'un değişkenlerin identifier name'lerine göre değerlerini görmek için bir dizi kural olduğundan bahsetmiştik. Ancak çoğu zaman birden fazla scope olur.

       Bir fonksiyon ya da block bir diğerinin içine gömülü olabilir. Bu yüzden motor bir değişkenin değerini mevcut scope içinde bulamazsa, bulana değin dış scopelara çıkamaya ve aramaya devam eder.
                     
 * ! Hatalar

       function foo(a) {
              console.log( a + b );
              b = a;
       }
       foo( 2 );

       Neden RHS ve LHS referanslara ihtiyacımız olduğu hatalar konusunda anlaşılabilir. Burada ' b ' için ilk RHS araması yapıldığında karşılığı bulunamayacaktır ve "undeclared" variable olarak etiketlenip, hangi scope'da olunursa olunsun ' ReferenceError ' hatası motor tarafından fırlatılacaktır.

       Ancak bunun aksine eğer LHS look-up'ı yapılıyorsa ve program strict modda değilse global scope'da değeri bulamasa dahi aynı isimle o değeri yaratır ve motora verir.

       Strict Mode ES5'de eklenen ve normal/relaxed/lazy modlarda farklı davranışlarn sergileyen bir özelliktir. Bu davranışlardan biri eğer ki globalde de bahsedilen değer bulunamadıysa RHS durumunda olduğu gibi ' ReferenceError ' fırlatılmasıdır.

       Bunların dışında eğer ki değişkenin değeri RHS look-up'ında bulunmuş ancak o değerle o değerin yapabileceklerinden fazlası istendiyse bu durumda da TypeError hatası fırlatılır.



 */



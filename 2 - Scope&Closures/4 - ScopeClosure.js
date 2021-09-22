/**
    *! Closure: 
        Closure, fonksiyon kendisinin lexical scope'unun dışında execute edilirken bile lexical scope'unu hatırlayabildiği ve erişebildiği zamandır.

        ->    function foo() {
                   var a = 2;
  
                   function bar() {
                           console.log( a ); // 2
                   }
  
                   bar();
              }
  
              foo();

              
        bar() fonksiyonu lexical-scope look-up rule sebebiyle dış scope'daki ' a ' değişkenine erişebilir(RHS). Bu bir closure mudur?

        Teknik olarak belki. Ancak tanımımıza göre tam olarak öyle değil. Burada bar() fonksiyonunun ' a ' ya referansta bulunmasını açıklamanın en kesin yolu lexical scope look-up rule'lardır ve bu kurallar closure'un sadece parçasıdır.

        Akademik bir perspektifle yukarıdaki pasajın söylediği şey, bar() fonksiyonunun foo()'nun scope'u üzerinde bir closure'a sahip olduğudur(ve gerçekte, bar()'a erişimi olan kalan diğer tüm scopeların da üzerinde, bu durumda global scope). Başka bir deyişle bar(), foo() fonksiyonunun scope'unun üzerini kapar. Sebebi basitçe bar()'ın foo()'nun içerisine yuvalanmış olarak görünmesidir.

        Ancak closure'u bu şekilde tanımlamak doğrudan gözlenebilir değildir, ne de bu parça içinde closure'u çalışabiliriz. Burada daha çok gördüğümüz lexical scope'dur, closure kodun arkasında gizemli bir değişen gölge olarak kalır.

        Closure'ı daha görünür kılalım:


        ->    function foo() {
                    var a = 2;

                    function bar() {
                        console.log( a );
                    }

                    return bar;
                }

                var baz = foo();

                baz(); // 2 -- Whoa, closure was just observed, man.

        
        Normalde gözlemeyi beklediğimiz şey garbage collector'un fonksiyon kapatıldıktan sonra fonksiyon içinde olan her şeyi hafızadan silmesiydi. Ancak closure buna izin vermez. Scope'un içi açıkçası hala kullanımdadır ve onu kullanan da bar() fonksiyonun kendisidir.

        Deklare edildiği yer itibarıyla bar() fonksiyonu foo()'nun scope'u üzerinde lexical scope closure'a sahiptir ve bu, o scope'u bar() fonksiyonunun ilerideki herhangi bir zamanda referansı için canlı tutar. 

        ** bar() o scope için hala referansa sahiptir ve bu referansa closure denir.

       ->       function foo() {
                    var a = 2;
                
                    function baz() {
                         console.log( a ); // 2
                    }
                
                    bar( baz );
                }
            
                function bar(fn) {
                    fn(); // look ma, I saw closure!
                }
            
       
       
                
       ->       var fn;
            
                function foo() {
                    var a = 2;
                
                    function baz() {
                        console.log( a );
                    }
                
                 fn = baz; // assign baz to global variable
                }
            
                function bar() {
                    fn(); // look ma, I saw closure!
                }
            
                foo();

                bar(); // 2

    *! Şimdi Görelim
                
        Bundan önceki kodlar biraz akademikti ve closure'un kullanımı göstermeye yönelik yapaydı. Ancak bahsettiğimiz üzere closure kodun her tarafında var olması yönüyle havalı bir oyuncaktan fazlası. Şu koda bakarsak:

        ->  function wait(message) {

                   setTimeout( function timer(){
                        console.log( message );
                    }, 1000 );
            }
            
            wait( "Hello, closure!" );

        
        timer isimli fonksiyonu alıp setTimeout(..) fonksiyonuna geçtik. Ancak timer wait(..) fonksiyonun scope'u üzerinde, message değişkeninin referansını korumak ve kullanmak üzere scope closure(kapsam kapatma?)'a sahiptir. 
        
        wait(..) fonksiyonun execute edilmesinden 1000 milisaniye sonra, onun inner scope'u normalde yok olmuş olmalıyken, bu anonim fonksiyonun scope üzerinde hala kapanması mevcuttur. Motorun derinliklerinde, yerleşik yardımcı program setTime out(..), muhtemelen fn veya func veya bunun gibi bir şey olarak adlandırılan bazı parametrelere başvuruda bulunur. Motor, iç zamanlayıcı işlevimizi çağıran bu işlevi çağırmaya gider ve sözcüksel kapsam referansı hala sağlamdır.

        ** Closure.

        Her ne zaman ve nerede fonksiyonlara birinci dereceden değerler olarak davranır(mesela onları fonksiyonlara değer olarak geçmek) ve onları sağa sola geçerseniz, muhtemelen closure'larla yüz yüze geleceksiniz demektir. Timerlarda, event handlerlarda, ajax requestlerde, pencereler arası mesajlaşmada, web workerlarda veya her tür senkron/asenkron görevde, bir callback fonksiyonu kullandığınızda, etrafa biraz closure salmaya hazır olun.

        *? Not:
            IIFE'nin closure olduğu iddia edilir ancak tanımımıza göre buna pek katılamayız. Çünkü IIFE kendi lexical scope'u dahilinde çalışır.

        
        *! Döngüler ve Closure

            En yaygın standart closure örneği mütevazı bir looptur:

                ->  for (var i=1; i<=5; i++) {
                        setTimeout( function timer(){
                                        console.log( i );
                        }, i*1000 );
                    }

            Normalde beklediğimiz sonuç 1'den 5'e kadar olan sayıların birer saniye artarak ekrana yazdırılmasıdır. 

            Ancak kodu çalıştırdığımız zaman gördüğümüz 5 defa 6'nın bir saniyelik aralıklarla yazdırılması olacak.

            Ne?

            İlk olarak 6'nın nereden geldiğini açıklayalım. Döngünün sonlanma koşulu i'nin 6'dan küçük olmasıdır. Dolayısıyla i 6 olduğunda döngü biter ve i'nin son değeri 6'dır.

            Timeout fonksiyonunun callback'leri ancak döngü tamamlandığında iyi çalışır. Gerçekte, zamanlayıcı ilerledikçe, hatta her iterasyon için setTimeout(..., 0) olsa bile, bütün fonksiyon callbackleri döngü tamamlandıktan sonra çalışır ve ekrana 6 yazdırılacağı anlamına gelir.

            Ancak soru bu değildir. Neden kodumuz semantik açıdan davranması gerektiği gibi davranmıyor? 

            Kodun semantik açıdan normal davranması için eksik olan şey, iterasyonlar sırasında, her loop iterasyonun kendi ' i ' kopyasını yakaladığını ima etmemizdir. Ancak scope'un çalışmak şekli, her loop için ayrı olan bu her 5 fonksiyonun, her ne kadar onlar ayrı looplarda tanımlanmış da olsalar, aynı müşterek global scopeda kapatılmalarıdır ve bu da sadece tek bir i değerine sahip olmaları anlamına gelir.

            Tabii ki bütün fonksiyonlar aynı referansı paylaşıyor. Loop yapısıyla ilgili olan bir şey arka tarafta çok karmaşık işler dönüyormuşçasına aklımızın karışmasına sebebiyet verebilir. Ancak karmaşık bir şey yok. 5 tane callback fonksiyonunun ardı ardına bir loop olmadan tanımlanmasından farkı yok bu durumun.

            Tamam, öyleyse sıcak sorumuza dönelim. Eksik olan ne? Biraz daha closured scope'a ihtiyacımız var. Spesifik olarak her loop iterasyonu için yeni bir closure'a ihtiyacımız var. Spesifik

            2. bölümde IIFE'nin, fonksiyonun deklare edilmesiyle scope yarattığını ve onu hemen execute ettiğini öğrenmiştik.

            Deneyelim:

            ->  for (var i=1; i<=5; i++) {
                    (function(){
                        setTimeout( function timer(){
                            console.log( i );
                        }, i*1000 );
                    })();
                }
            
                    
            Daha çok scope'umuz olmasına rağmen işe yaramadı. Her timeout callback fonksiyonu IIFE tarafından yaratılan her iterasyon scope'u üzerine kapanıyor.

            Eğer ki scope boşsa sadece scope'a sahip olmak yeterli değildir. Yakından bakın. IIFE sadece hiçbir şey yapmayan scope'a sahip. İçerisinde işe yarar bir şeyler olması gerek

            ->  for (var i=1; i<=5; i++) {
                    (function(){
                        var j = i;
                        setTimeout( function timer(){
                            console.log( i );
                        }, i*1000 );
                    })();
                }


            Bu çalıştı. Daha temiz versiyonu da:

            ->  for (var i=1; i<=5; i++) {
                    (function(j){
                        setTimeout( function timer(){
                            console.log( j );
                        }, j*1000 );
                    })( i );
                }

        *! Block Scoping Revisited
            
            Bir önceki başlıkta per-iteration block scope kullandık. Bölüm 2'de de, blok gaspeden ve tam olarak o noktada değişken deklare eden ' let ' keywordünü gördük

            Aslında o yakından bakarsak bloğu scope'a çevirir. Dolayısıyla bu kodda çalışır:

            ->  for (var i=1; i<=5; i++) {
                    let j = i; // yay, block-scope for closure!
                    setTimeout( function timer(){
                        console.log( j );
                    }, j*1000 );
                }

            Ancak hepsi bu değil. Let keyword'ünü head'de de kullanabiliriz. Bu değişkenin loop için sadece bir kere değil her iterasyon için deklare edileceğini söyler. Bu da her alt iterasyonun bir önceki iterasyonun son değeriyle başlayacağını söyler.

        *! Modules

            Closure'un gücünden faydalanan ancak görünürde callback'lerle ilgili olmayan kod pattern'leridir.

            ->  function foo() {
                    var something = "cool";
                    var another = [1, 2, 3];

                    function doSomething() {
                        console.log( something );
                    }

                    function doAnother() {
                        console.log( another.join( " ! " ) );
                    }
                }

            Bu kodda görünür bir closure yok. İki tane private data değişkeni ve her ikisi de foo()'nun iç scope'u üzerinde lexical scope'a(dolayısıyla bunlar birer closure!) sahip iki fonksiyon var.

            Ancak şunu düşünün:

            ->  function CoolModule() {
                    var something = "cool";
                    var another = [1, 2, 3];

                    function doSomething() {
                        console.log( something );
                    }

                    function doAnother() {
                        console.log( another.join( " ! " ) );
                    }

                    return {
                        doSomething: doSomething,
                        doAnother: doAnother
                };
                
                var foo = CoolModule();

                foo.doSomething(); // cool
                foo.doAnother(); // 1 ! 2 ! 3
                
            Bu javascriptte module dediğimiz pattern'dir.

            İlk olarak CoolModule() bir fonksiyondur ancak module instance'ının yaratılması için onun invoke edilmesi şarttır. Dış fonksiyon execute edilmeden, inner scope'un ve closure'lar yaratılmaz.

            İkinci olarak, modül bir obje döner. Bu obje iç fonksiyonların referansına sahiptir ancak değişkenlerin referansına sahip değildir. Değişkenleri saklı ve private tutarız. Bu objnein modülümüz için public bir API return ettiğini düşünmek uygundur.

            Bu objenin return değeri en nihayet foo adlı dış değişkene atanır ve daha sonra biz bu prop'lara API üzerinden ulaşırız.

            *? Not:
                
                İllaki obje dönmek zorunda değiliz. İç fonksiyonları doğrudan return edebiliriz. jQuery bunun için iyi bir örnektir. 'jQuery' ve ' $ ' tanımlayıcıları jQuery modulleri için public API'dir ancak onlar kendileri bir fonksiyondur(her fonksiyon obje olduğundan kendileri proplara sahiptir).

            doSomething() ve doAnother() fonksiyonları module instance'ının inner scope'u üzerinde closure'a sahiptir( CoolModule()'un invoke edilmesiyle ulaştı ). Bu fonksiyonları return ettiğimiz objenin prop referansı olarak ( bkz : foo.doAnother() ) lexical scope'un dışına taşıdığımızda, closure'un gözlemlenebileceği ve taşınabileceği bir koşul elde etmiş olduk.

            Basitçe ifade edersek, module patternin exercise edilmesi için iki gereklilikten bahsedebiliriz:
            
            1) Bir dış fonksiyon olmalı ve en az bir kere invoke edilmeli(her invoke yeni bir instance demek)

            2) Bu çevrelenmiş fonksiyonun en az bir iç fonksiyonu geri return edilmeli, böylece bu iç fonksiyon private scope üzerinde closure'a sahip olur ve bu private state'e erişebilir ve onu modifiye edebilir

            Önceki kod parçası module creator olarak adlandırılan bağımsız CoolModule() 'u gösteriyordu ve bu her çağrıldığında yeni bir modul instance'ı yaratıyordu. Bu patternin hafif bir versiyonu sadece tek bir örneği önemsediğinizde ortaya çıkar, bir tür singleton:

            ->  var foo = (function CoolModule() {
                    var something = "cool";
                    var another = [1, 2, 3];
                    function doSomething() {
                      console.log(something);
                    }
                    function doAnother() {
                      console.log(another.join(" ! "));
                    }
                    return {
                       doSomething: doSomething,
                       doAnother: doAnother,
                    };
                })();
                foo.doSomething(); // cool
                foo.doAnother(); // 1 ! 2 ! 3

            Burada module fonksiyonumuzu IIFE'ye dönüştürdük ve tek modul instansımız foo tanımlayıcısına onu doğrudan invoke edip atadık.

            Modüller birer fonksiyondur ve parametre alırlar:

            ->  function CoolModule(id) {
                    function identify() {
                        console.log( id );
                    }

                    return {
                        identify: identify
                    };
                }
                var foo1 = CoolModule( "foo 1" );
                var foo2 = CoolModule( "foo 2" );
                foo1.identify(); // "foo 1"
                foo2.identify(); // "foo 2"

            Bir başka hafif ama güçlü module pattern çeşidi public API olarak return ettiğiniz objeye isim vermektir:

            ->  var foo = (function CoolModule(id) {

                              function change() {
                                  // modifying the public API
                                  publicAPI.identify = identify2;
                              }
                          
                              function identify1() {
                                  console.log( id );
                              }
                          
                              function identify2() {
                                  console.log( id.toUpperCase() );
                              }
                          
                              var publicAPI = {
                                  change: change,
                                  identify: identify1
                              };
                          
                              return publicAPI;
                          })( "foo module" );

                          foo.identify(); // foo module
                          foo.change();
                          foo.identify(); // FOO MODULE

            Public API'nin iç referansını module instance'ının içinde tutarak, module instance'ını içeriden değiştirebilirsiniz. Propertiler ekleyip çıkarabilir ve onların değerlerini değiştirebilirsiniz.

        *! Modern Modüller

            Birçok module dependency loaders/managers kolay bir API için bu pattern'i kullanır:

            -> var MyModules = (function Manager() {
                    var modules = {};

                    function define(name, deps, impl) {
                        for (var i=0; i<deps.length; i++) {
                        deps[i] = modules[deps[i]];
                        }
                        modules[name] = impl.apply( impl, deps );
                    }

                    function get(name) {
                        return modules[name];
                    }

                    return {
                        define: define,
                        get: get
                    };
              })();

              
              Bu kodun kilit noktası modules[name] = impl.apply( impl, deps ). Bu modul için tanım wrapper fonksiyonu invoke ediyor ve return value'yi, modulün API'sini, ismiyle izlenebilen iç bir listeye kaydediyor.

              Bazı modülleri nasıl tanımladığımız:

              ->    MyModules.define( "bar", [], function(){
                        function hello(who) {
                            return "Let me introduce: " + who;
                        }
                    
                        return {
                            hello: hello
                        };
                    }); 

                    MyModules.define( "foo", ["bar"], function(bar){
                        var hungry = "hippo";
                        function awesome() {
                            console.log( bar.hello( hungry ).toUpperCase() );
                        }
                        return {
                            awesome: awesome
                        };
                    } );

                    var bar = MyModules.get( "bar" );

                    var foo = MyModules.get( "foo" );

                    console.log(
                         bar.hello( "hippo" )
                    ); // Let me introduce: hippo

                    foo.awesome(); // LET ME INTRODUCE: HIPPO

        *! Future Models
                        
                ES6 modules inline formata sahip değildir, onlar ayrı dosyalarda tanımlanırlar. Browserlar/Motorlar default module yükleyicisine sahiptirler(override edilebilirler), senkron olarak modüller yüklenir.

                *? bar.js
                        
                    -> function hello(who) {
                             return "Let me introduce: " + who;
                       }
                       export hello;

                *? foo.js

                    -> // import only `hello()` from the "bar" module
                          import hello from "bar";

                          var hungry = "hippo";
                          
                          function awesome() {
                             console.log(
                                hello( hungry ).toUpperCase()
                             );
                          }

                          export awesome;

                *? baz.js
                
                          // import the entire "foo" and "bar" modules
                          module foo from "foo";
                          module bar from "bar";

                          console.log(
                           bar.hello( "rhino" )
                          ); // Let me introduce: rhino
                          
                          foo.awesome(); // LET ME INTRODUCE: HIPPO



                    





                






                

 */

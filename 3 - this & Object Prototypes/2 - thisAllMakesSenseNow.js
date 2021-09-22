/**
        *! Call-Site (Çağrı Mevkisi)

            Fonksiyonun çağrıldığı yerdir. Peki this keywordü neye refere ediyor. 

            Call-stack, bizi execution'ın şuanki anına götüren, çağrılan fonksiyonların yığınlandığı yer.

            Önemsediğimiz call-site şuanda execute edilen fonksiyonun önceki çağrısının içinde.

            Call-stack ve call-site'yi gösterelim:


            ->  function baz() {
                    // call-stack is: `global` ->  `baz`
                    // so, our call-site is in the global scope
                    console.log( "baz" );
                    bar(); // <-- call-site for `bar`
                }

                function bar() {
                    // call-stack is: `baz` -> `bar`
                    // so, our call-site is in `baz`
                    console.log( "bar" );
                    foo(); // <-- call-site for `foo`
                }

                function foo() {
                    // call-stack is: `baz` -> `bar` -> `foo`
                    // so, our call-site is in `bar`
                    console.log( "foo" );
                }

                baz(); // <-- call-site for `baz`

            
            Gerçek call-site'yi bulurken dikkatli olun( call-stack'ten ), çünkü this keywordü için önemli olan sadece budur.

        *! Sadece Kurallar

            Call-site this'in nereyi point edeceğini nasıl belirliyor. Burada 4 kurala bakılıyor.

        *! Default Binding

            İlk kural fonksiyon çağrılarının en yaygın durumundan kaynaklanır: bağımsız(standalone) fonksiyon çağrısı. Bunu diğer kuralların hiçbiri geçerli olmadığında dikkate alınan default hepsini yakala kuralı olarak düşünebilirsiniz.

            Şu kodu düşünün:


            ->  function foo() {
                     console.log( this.a );
                }

                var a = 2;

                foo(); // 2


            Farkında olmanız gereken ilk şey global scope'da tanımlanan her değişken aslında global objenin aynı isimli propertileridir.

            İkinci olarak, foo() fonksiyonundaki this.a, global değişkenimiz a'yı alıyor. Çünkü bu durumda this için default binding'imiz function call'a uygulanır ve bu, bu durumda global objedir.

            Ancak strict modda global obje default binding için erişilebilir değildir(strict mode global proplara erişimi engeller)


            ->  function foo() {
                    "use strict";
                     console.log( this.a );
                }

                var a = 2;
                
                foo(); // TypeError: `this` is `undefined`

        *! Implicit Binding(Örtük Bağlama)

            Dikkate alınması gereken diğer kural call-site'in, owning veya containing obje olarak da anlandırılan context objesine sahip olmadığıdır.

            Mesela:

            ->  function foo() {
                     console.log( this.a );
                }

                var obj = {
                    a: 2,
                    foo: foo
                };

                obj.foo(); // 2


            İlk olarak foo()'nun deklare edilme biçimine bakın ve sonra da obj üzerine referans propertisi olarak eklenme şekline bakın. İki durumda da fonksiyon obj objesi tarafından "owned(sahip olunmuş)" veya "contained(kaplanmış)" değildir.

            Ancak call site, fonksiyona refere edebilmek için obj contextini kullanır. Bu yüzden fonksiyonun çağrıldığı zamanda obj objesinin fonksiyon referansını own veya contain ettiğini söyleyebiliriz.

            Bu patterna ne isim koyarsanız koyun, foo()'nun çağrıldığı noktada o, önüne bir obje referansı alır. Bir fonksiyon referansı için context objenin olduğu durumlarda, implicit binding, bu binding için bu objenin bu fonksiyon çağrısında kullanılması gerektiğini söyler. Çünkü obje, foo() call'ı için bu durumda this'dir( this.a = obj.a ).

            *? Not:

                Her zaman top level obje this'in konusudur:

                ->  function foo() {
                         console.log( this.a );
                    }
                    
                    var obj2 = {
                        a: 42,
                        foo: foo
                    };

                    var obj1 = {
                        a: 2,
                        obj2: obj2
                    };

                    obj1.obj2.foo(); // 42

        *! Implicitly Lose

            this binding ile ilgili en yaygın hayal kırıklığı örtük olarak bağlanmış fonksiyon bu binding'i kaybettiğinde ortaya çıkar. Bu strict modun durumuna göre ya global objeye ya da undefined'a düşüldüğü anlamına gelir.

            Mesela: 


            ->  function foo() {
                    console.log( this.a );
                }

                var obj = {
                    a: 2,
                    foo: foo
                };

                var bar = obj.foo; // function reference/alias!
                
                var a = "oops, global"; // `a` also property on global object
                
                bar(); // "oops, global"


            Her ne kadar bar, obj.foo'ya referans olarak gözüküyor olsa da, gerçekte o, foo'nun kendisine farklı bir referanstan başka bir şey değildir. Dahası, önemli olan call-site'dır ve call-site ise bar()'dır ki bu da düz, dekore edilmemiş bir çağrıdır. Bu yüzden default binding uygulanır.

            Daha ince, yaygın ve beklenmedik olan bunun callback fonksiyonları pass ettiğimizde ortaya çıkmasıdır:

            
            ->  function foo() {
                    console.log( this.a );
                }

                function doFoo(fn) {
                    // `fn` is just another reference to `foo`
                    fn(); // <-- call-site!
                }

                var obj = {
                    a: 2,
                    foo: foo
                };

                var a = "oops, global"; // `a` also property on global object
                
                doFoo( obj.foo ); // "oops, global"

            
            Parametre pass etme implicit bir assign'dır, dolayısıyla burada da implicit referans ataması oluyor ve sonuç yine aynı. Bu fonksiyon bizim yazdığımız değil  js fonksiyonu olsa da sonuç değişmez.

        *! Explicit Binding (Açıktan Bağlama)

            Burada çalışacağımız şey, objeye bir prop olarak referans yapmadan fonksiyonu belirli bir objeyi this bindingi için çağırmaya zorlamak olacak.

            Bütün fonksiyonlar bu işte bize yardımcı olacak bazı araçlara( [[Prototype]] ) sahiptir. Özel olarak fonksiyonlar call(..) ve apply(..) metotlarına sahiptir.

            Bu araçlar ilk parametre olarak this için kullanacakları bir obje alırlar ve sonra bu fonksiyonu this'in bu özelleştirilmesiyle invoke ederler. Bu this'i doğrudan ne için kullanacağınızı belirtmesi yönüyle explicit binding olarak adlandırılır.

            Mesela:

            ->  function foo() {
                    console.log( this.a );
                }

                var obj = {
                    a: 2
                };

                foo.call( obj ); // 2


            Eğer sadece basit bir temel değer geçecekseniz( bool, number, string vs ) bu primitive value'yi obje formuna getirmeniz gerekmektedir( new String(..), new Boolean(..), or new Number(..) gibi). Buna boxing denir.

            Ancak bu çözümde implicit losing için bir çözüm sunamamaktadır.

        *! Hard Binding(Sıkı Bağlama)

            Ancak bir tür explicit binding bir numaraya sahiptir.

            Mesela:

            
            ->  function foo() {
                    console.log( this.a );
                }

                var obj = {
                    a: 2
                };

                var bar = function() {
                    foo.call( obj );
                };

                bar(); // 2
                
                setTimeout( bar, 100 ); // 2
                
                // hard-bound `bar` can no longer have its `this` overridden
                bar.call( window ); // 2

            
            Burada implicit bir assignment yerine manuel olarak foo.call( obj )'yi çağıran bir fonksiyona sahibiz dolayısıyla burada sorun hem güçlü hem explicit bir hard binding'e sahibiz.

            Bir fonksiyonu hard binding ile çevrelemenin en kolay yolu, geçilen her parametre için ve alınan her return value için bir geçiş oluşturmaktır:


            ->  function foo(something) {
                    console.log( this.a, something );
                    return this.a + something;
                }

                var obj = {
                    a: 2
                };

                var bar = function() {
                    return foo.apply( obj, arguments );
                };

                var b = bar( 3 ); // 2 3
                
                console.log( b ); // 5


            Bu patterni açıklamanın bir diğer yolu reusable helper yaratmaktır:

            
            ->  function foo(something) {
                    console.log( this.a, something );
                    return this.a + something;
                }

                // simple `bind` helper
                function bind(fn, obj) {
                        return function() {
                            return fn.apply( obj, arguments );
                    };
                }

                var obj = {
                    a: 2
                };

                var bar = bind( foo, obj );
                var b = bar( 3 ); // 2 3
                console.log( b ); // 5

        *! API call "contexts"

            Birçok kütüphane ve host environmentta "context" olarak adlandırılan callback fonksiyonunuzun belirli bir this bind'ı kullandığından emin olma işlevi gören opsiyonel bir parametre bulunur.

            Mesela: 


            ->  function foo(el) {
                    console.log( el, this.id );
                }

                var obj = {
                    id: "awesome"
                };

                // use `obj` as `this` for `foo(..)` calls
                [1, 2, 3].forEach( foo, obj );
                // 1 awesome 2 awesome 3 awesome


            İçsel olarak bu çeşitli fonksiyonlar call(..) veya apply(..) aracılığıyla explicit binding yaparak sizi kurtarır.

        *! new Binding

            OOP'de "constructor" class her new'lendiğinde çağrılan özel metotlardır. Bu şöyle görünür:


            ->    something = new myClass(..);


            Bu her ne kadar klasik OOP dillerindekine benzer bir syntax olsa da aslında tamamen farklıdır.

            İlk olarak constructor'ın javascriptte tam olarak ne olduğunu yeniden tanımlayarak işe başlayalım. Constructor'lar sadece new operatörü önlerindeyken çağrılan fonksiyonlardır. Ne class'lara iliştirilirler ne de class'ı instantiate(örnekleme) ederler. Hatta özel bir fonksiyon dahi değildirler. Özünde çağrılmaları için new gerektiren fonksiyonlardır.

            Aslında ortada constructor fonksiyonundan ziyade fonksiyonun constructor çağrısı vardır. 
            
            Bir fonksiyon önünde new ile çağrıldığında(yani constructor çağrısı olduğunda) şunlar otomatik gerçekleşir:

            1. Havadan yepyeni bir nesne yaratılır.

            2. İnşa edilen obje [[Prototype]]-bağlı hale getirilir.

            3. Yeni inşa edilen obje bu fonksiyon çağrısı için this binding olarak setlenir.

            4. Fonksiyon kendisine alternatif bir objeyi dönmüyorsa, yeni invoke edilen fonksiyon yeni inşa edilen objeyi otomatik olarak döner.

            Şu koda bakın : 


            ->  function foo(a) {
                        this.a = a;
                }

                var bar = new foo( 2 );
                console.log( bar.a ); // 2

            
            foo(..)'yu önünde new ile çağırarak, yeni bir obje inşa ettik ve bu objeyi foo(..) çağrısı için 'this' olarak set ettik.

            *? Öncelik sırası : new > explicit > implicit > default

        *! This'e Karar Verme

            Bu sorular sırasıyla sorulur ve cevabın olumlu olduğu yerde durulur:

            1) Fonksiyon new ile mi çağrılmış(new binding)? Eğer öyleyse, this yeni inşa edilen objemizdir.


            ->  var bar = new foo()

                
            2) Fonksiyon call or aplly ile mi çağrılmış(explicit binding),bind'in içine hard bind gizlenmiş olsa bile(çünkü new her türlü önceleniyordu). Eğer öyleyse this explicitly olarak belirtilen obje.


            ->  var bar = foo.call( obj2 )
            
            
            3) Fonksiyon, owning ya da containing olarak da bilinen, bir bağlam ile mi çağrılmış(implicit binding)? Eğer öyleyse this bağlamdaki objedir.


            ->  var bar = obj1.foo()


            4) Diğer durumlarda this default'tur(default binding). Eğer strict modda ise undefined gelir, diğer durumda global obje seçilir.


            -> var bar = foo()


        *! Binding İstisnaları

            Bazen farklı davranışlar beklerken default binding ile karşılaşılabilir. Bazı istisnalar vardır.

            *? this'in Gözardı Edilmesi

                Call, apply veya bind'a null parametre geçilirse bu görmezden gelinir ve default binding uygulanır.

                Bu uygulanması saçma olarak görünse de apply kullanılarak array değerlerini fonksiyon çağrılarına yaymak yaygın bir kullanımdır. Benzer olarak bind(..) ile fonksiyon çağrılarına sabit parametreler atayabilirsiniz:


                ->  function foo(a,b) {
                        console.log( "a:" + a + ", b:" + b );
                    }

                    // spreading out array as parameters
                    foo.apply( null, [2, 3] ); // a:2, b:3

                    // currying with `bind(..)`
                    var bar = foo.bind( null, 2 );
                    
                    bar( 3 ); // a:2, b:3

                
                Eğer obje kullanmıyor ve parametre geçmek istiyorsanız obje kısmına null geçmek mantıklıdır.

                Apply için ES6'da spread operatörü vardır ve orada apply kullanmak zorunda değiliz ancak bind için henüz bir alternatif yoktur.

                Ancak bu kullanımın bazı fonksiyon çağrılarının this referansını globale(default) vermesinden dolayı null geçilen referanslarında kaçınılmaz olarak bu referansa sahip olmasına sebebiyet veren bir tehlikesi vardır.

                    ** Daha Güvenli this

                        Bu sorundan kurtulmak için güvenli bir obje ignore etme pratiği var. Buna ödünç bir terimle "DMZ" (de-militarized zone) pratiği denilebiilir. Buradaki amaç tamamen boş, delege edilmemiş obje kullanmaktır.


                        ->  function foo(a,b) {
                                    console.log( "a:" + a + ", b:" + b );
                            }
                            
                            // our DMZ empty object
                            var ø = Object.create( null ); // doğrudan {} 'dan farkı protetiplerin de dahil edilmiyor oluşudur
                            
                            // spreading out array as parameters
                            foo.apply( ø, [2, 3] ); // a:2, b:3

                            // currying with `bind(..)`
                            var bar = foo.bind( ø, 2 );
                            bar( 3 ); // a:2, b:3
                    
            *? Dolaylı(Indirection)
                    
                Kasıtlı veya değil eğer fonksiyonlara dolaylı referans oluşturulursa, bu fonksiyon invoke edildiğinde, default binding uygulanır.
                    
                En yaygın dolaylı referans atamalarda ortaya çıkar:
                    
                    
                ->  function foo() {
                        console.log( this.a );
                    }
                
                    var a = 2;
                    var o = { a: 3, foo: foo };
                    var p = { a: 4 };
                    
                    o.foo(); // 3
                    
                    (p.foo = o.foo)(); // 2
                
                Burada sonuç değeri asıl fonksiyonu refere eder( foo() ) dolayısıyla call-site beklenilen gibi p.foo() veya o.foo()'nun değil, foo()'nundur.    Dolayısıyla default binding uygulanır. Dolayısıyla default binding
                
            *? Yumuşatıcı Bağlama(Softening Binding)
                
                Hard binding'in nasıl spesifik bir this kullanımı için nasıl bir strateji olduğunu görmüştük. Ancak hard binding'in kullanımı this seçiminin    override edilmesini hem implicit bindingler için hem de alt explicit bindingler için önlediğinden esnekliğimizi çok düşürmektedir.
                
                Fonksiyon için hala implicit ve explicit bindingler aracılığıyla manuel this setlemeyi erişilebilir bırakarak default binding için farklı bir   default belirleyebilmek güzel olurdu.
                
                Bu davranışı sağlayan soft binding utility olarak adlandıracağımız bir araç inşa edebiliriz.
                
                    
                ->  if (!Function.prototype.softBind) {
                        Function.prototype.softBind = function(obj) {
                            var fn = this;
                            // capture any curried parameters
                            var curried = [].slice.call( arguments, 1 );
                            var bound = function() {
                                return fn.apply(
                                    (!this || this === (window || global)) ?
                                        obj : this
                                        curried.concat.apply( curried, arguments )
                                    );
                            };
                            bound.prototype = Object.create( fn.prototype );
                            return bound;
                        };
                    }
                
                
                Burada eğer this'in call time'ı global veya undefined ise bizim belirlediğimiz objeye setlenir this. Diğer durumlarda this'e dokunulmaz.
                
                Kullanımı :
                
                
                ->  function foo() {
                            console.log("name: " + this.name);
                    }
                
                    var obj = { name: "obj" },
                        obj2 = { name: "obj2" },
                        obj3 = { name: "obj3" };
                
                    var fooOBJ = foo.softBind( obj );
                    
                    fooOBJ(); // name: obj
                    
                    obj2.foo = foo.softBind(obj);
                    obj2.foo(); // name: obj2 <---- look!!!
                    
                    fooOBJ.call( obj3 ); // name: obj3 <---- look!
                    
                    setTimeout( obj2.foo, 10 );
                    // name: obj <---- falls back to soft-binding
                
            *? Lexical this
                
                ES6 ile birlikte gelen arrow fonksiyonlar tanıtmış olduğumuz bu 4 kurala uymazlar. Arrow fonksiyonlar bunun yerine içine enclose edildikleri    fonksiyon veya global scope'u this'lerler.
                
                
                ->  function foo() {
                        // return an arrow function
                        return (a) => {
                            // `this` here is lexically inherited from `foo()`
                            console.log( this.a );
                        };
                    }
                
                    var obj1 = {
                        a: 2
                    };
                
                    var obj2 = {
                        a: 3
                    };
                
                    var bar = foo.call( obj1 );
                    bar.call( obj2 ); // 2, not 3!
                
                
                foo()'nun içinde yaratılan arrow fonksiyon call time'da foo'nun this'inde ne varsa onu yakalar. foo() obj1'e this bağlı olduğundan, bar(return  edilen arrow fonksiyona referanstır)'da obj1'e bağlıdır. Arrow-fonksiyonun lexical binding'i override edilemez(new tarafından bile).
                
        
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
*/
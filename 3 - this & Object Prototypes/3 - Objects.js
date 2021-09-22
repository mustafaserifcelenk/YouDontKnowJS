/**
    *! Syntax

        Objeler 2 çeşit gelirler: declarative(literal) ve constructed form.

        Literal:

        ->  var myObj = {
                key: value,
                ...
        };


        Constructed:

        ->  var myObj = new Object();
            myObj.key = value;


        Bu iki formda aynı sonucu döner. Aralarındaki tek fark literal deklarasyona aynı anda birden fazla key/value ikilisi ekleyebilirken, constructed formuna teker teker eklenebilir. Genelde obje yaratılırken ilki kullanılır.


    *! Tip

        Javascriptte 6 tane tip vardır: string, number, boolean, null, undefined, object. Simple primitive'ler(string, number, boolean, null, undefined) obje değildir. 

        "Javascript'te herşey objedir." söylemi yanlıştır. Bunun tersine sadece bir kaç tane complex primitive diyebileceğimiz alt tür özel obje mevcuttur.

        Function objenin alt tipidir(teknik olarak çağrılabilir obje). Javascriptte fonksiyonlar "first class" olarak ifade edilirler, bu onların normal obje olduğunu belirtir(çağrılabilir davranış semantiği ekli olarak) ve bu yüzden normal objeler gibi müdahale edilebilir.

        Arraylerde extra davranışlara sahip olan objelerdir. Arraylardeki yapı genel objelere oranla çok daha yapılıdır.

    *! Built-in Objeler 

        Geriye kalan objelere built-in objeler denir. Her ne kadar simple primitive benzerleriyle doğrudan alakalı gibi gözükseler de gerçekte onların ilişkisi çok daha karmaşıktır: String, Number, Boolean, Object, Function, Array, Date, RegExp, Error.

        Bunlar gerçek tiplerinin görünüme sahip olsalar da javascript'te aslında sadece built-in fonksiyonlardır. Bu built-in fonksiyonların her biri constructor olarak kullanılabilir(yani new'lenebilirler). 

        ->  var strPrimitive = "I am a string";
            typeof strPrimitive; // "string"
            strPrimitive instanceof String; // false
            
            var strObject = new String( "I am a string" );
            typeof strObject; // "object"
            strObject instanceof String; // true

            // inspect the object sub-type
            Object.prototype.toString.call( strObject ); // [object String]


        Görüldüğü üzere strObject String constructor ile yaratılan bir objedir.

        Primitive değer olan "I am a string" obje değildir, o primitive literaldir ve değeri(immutable) değişmez. Onun üzerinde, uzunluğunu kontrol etme, tekil bir karaktere erişmek gibi bir operasyon yapabilmek için String objesine ihtiyaç vardır.

        İşin güzel tarafı, dil gerektiğinde primitive değeri obje olanına çevirir.

        null ve undefined obje kapsayıcısına sahip değildir. Tersine date'te literal forma sahip değildir.

        Objects, Arrays, Functions ve RegExps(regular expressions)'ların hepsi literal veya construct olup olmamasına bakılmaksızın objedirler.

        Error objesi nadir olarak code'un içinde açıktan yaratılır ancak genelde otomatik olarak hata fırlatıldığında yaratılırlar. 

    
    *! İçerikler

        Objenin içerikleri her tipte isimlendirilmiş mevkilere konumlandırılırlar ve onlara obje denir.

        Objenin içeriği derken bu değerlerin objenin içine depolandığını ima ederiz ancak bu sadece görüntüden ibarettir.

        ->  myObject.a; // property access

            myObject["a"]; // key access


        İkisi arasındaki tek fark ' . ' operatörü identifier uyumlu isim gerektirirken, ' [".."] ' herhangi bir UTF-8/Unicode uyumlu string alabilir. Mesela "Super-Fun!" propertisine property access ile erişemezsiniz.


    *! Computed Property İsimleri

        ->  var prefix = "foo";

            var myObject = {
                 [prefix + "bar"]: "hello",
                 [prefix + "baz"]: "world"
            };
            
            myObject["foobar"]; // hello
            myObject["foobaz"]; // world


    *! Arrayler

        Arraylere properti eklenebilir:

        ->  var myArray = [ "foo", 42, "bar" ];

            myArray.baz = "baz";
            
            myArray.length; // 3
            
            myArray.baz; // "baz"

        
        Ancak bu iyi bir fikir değildir.

        
    *! Properti Tanımlayıcı

        ->  var myObject = {
                a: 2
            };

            Object.getOwnPropertyDescriptor( myObject, "a" );
            // {
            //   value: 2,
            //   writable: true,
            //   enumerable: true,
            //   configurable: true
            // }

        Normal obje propertisi sadece 2 değerinden ibaret değildir, o ekstradan 3 farklı obje karakteristiğine de sahiptir: writable, enumerable ve configurable.

        Object.defineProperty(..) kullanılarak yeni bir property ekleyebilir veya varolan birini dilediğimiz bir karakteristiğe modifiye edebiliriz.

        ->  var myObject = {};

            Object.defineProperty( myObject, "a", {
                value: 2,
                writable: true,
                configurable: true,
                enumerable: true
            } );

            myObject.a; // 2


        *? Writable

            Propertiyi değiştirebilme kabiliyetinin kontrolü. Strict modda writable false karakterin modifiye etme denemesi hata verir.

        
        *? Configurable

            Propertinin configurable olması onun descritor'ını defineProperty(..) kullanarak değiştirebileceğimiz anlamına gelir. Bunu bir kere false almak geri dönüşü olmayan bir işlemdir.

            Burada tek istisnai durum configurable false ise writable true'dan false'a çekilebilir.

            Aynı zamanda configurable: false durumunda delete'de çalışmaz:

            delete myObject.a;


        *? Enumerable

            Burada son bahsedilecek descriptor(getters/setters adlı iki tane daha var) enumerable.

            Bu objenin enumeration işlemlerine(mesela for...in loop'u) girmesini engeller.

    
    *! Immutability(Değişmezlik)

        Bazen propertilerin veya objelerin sabit kalmasını değişmemesini istersiniz. Bunun bir çok farklı yolu vardır. Ancak unutulmaması gereken şey bu yöntemlerin sadece objeyi ve onun doğrudan karakteristik proplarını etkilediğidir. Eğer bir obje bir diğer objeye(arraye, foksiyona vs.) referans veriyorsa, referans verdiği obje bu değişmezlikten etkilenmez.

        ->  myImmutableObject.foo; // [1,2,3]
            myImmutableObject.foo.push( 4 );
            myImmutableObject.foo; // [1,2,3,4]

        
        Objenin proplarını da immutable yapmak için onlarada benzer işlemler uygulanmalıdır.


    *! Prevent Extensions (İlavelerden Koruma)

        Objeye yeni proplar eklenmesini engellemek istiyorsanız Object.preventExtensions(..); kullanabilirsiniz. Sadece strict modda hata fırlatır.


    *! Seal (Kabuk)

        Object.seal(..) sealed obje yaratır, yani olan objeyi alır onu preventExtensions yapar, ekstradan mevcut tüm proplarını "configurable: false" yapar. Bu durumda yapılmasına izin verilen tek şey değerlerin değiştirilmesi.


    *! Freeze (Dondurma)

        Object.freeze(..) donmuş bir obje yaratır yani objeyi alır onu kabuklar ve ekstradan tüm propları writable false yapar.


    *! [[Get]]

        Get objenin bir propuna erişilmeye çalışılıdığında bu görevi üstlenen algoritmadır. İlk olarak değere bakar daha sonra [[Prototype]] zincirinde dolaşır. [[Get]]'in bir önemli sonucu eğer en nihayet bir değer döndüremezse, undefined döner. Bu normal değişkenlerde ReferenceError'dür.


    *! [[Put]]

        Get olduğu gibi bir de obje yaratmak veya değerini güncellemek için [[Put]] vardır.

        Eğer değer zaten varsa şu işlemler yapılır:

            1. Property accesser descriptor(getter/setter) mu? Eğer onlardan biriyse setter'ı çağır.

            2. Property writable'ı false olan bir data mı? Eğer öyleyse strict mod değilse sessizce başarısız ol, strict modda ise  TypeError ver.

            3. Diğer durumlarda varolan propu normal olarak setle.

        Eğer değer yoksa durum daha da karmaşık bir hale gelir. 


    *! Getters and Setters

        Default [[Put]] ve [[Get]] operasyonlarının tüm olayı var olan veya yeni değerleri nasıl setleyeceğimiz veya olan değerleri nasıl getireceğimizdir.

        ES5 bu default operasyonları obje düzeyinde değil ancak property düzeyinde ezmek için getters ve setters'leri kullanıma getirdi. Getters değeri getirmek için gizli bir fonksiyonu çağıran, setters ise değeri set etmek için gizli bir fonksiyonu çağıran proplardır.

        Getter veya setter veya her ikisine sahip bir prop tanımladığınızda, onun tanımı "accessor descriptor(Erişim tanımlayıcısı)" olur. Accessor descriptorda, prop'un değeri ve writable karakteristiği ignore edilir onun yerine dil get ve set değerlerinin karakteristiğini dikkate alır.

        ->  var myObject = {
                // define a getter for `a`
                get a() {
                return 2;
             }
            };

            Object.defineProperty(
                 myObject,  // target
                 "b",       // property name
                 {          // descriptor

                   // define a getter for `b`
                   get: function(){ return this.a * 2 },

                   // make sure `b` shows up as an object property
                   enumerable: true
             }
            );
            
            myObject.a; // 2
            myObject.b; // 4
        
        
        Değerin ne olduğuna bakılmaksızın her zaman fonksiyon return değeri getirilir:

        ->  var myObject = {
                 // define a getter for `a`
                 get a() {
                 return 2;
                 }
            };

            myObject.a = 3;
            myObject.a; // 2

        
        Setter olmadığı için a üzerinde değişiklik yapmak istediğimizde bu gerçekleşmeyecektir:

        ->  var myObject = {

                 // define a getter for `a`
                 get a() {
                    return this._a_;
                 },

                 // define a setter for `a`
                 set a(val) {
                     this._a_ = val * 2;
                 }
            };

            myObject.a = 2;
            myObject.a; // 4


    *! Existence (Varlık)

        Bir myObject.a prop'unun hiç olmaması durumunda veya doğrudan undefined atamasıyla undefined ile sonuçlanacağını söylemiştik. Bu sonuçla karşılaştığımızda hangisinin olduğuna nasıl karar vereceğiz.

        Propery'e propun değerini istemeden doğrudan bir prop'a sahip olup olmadığını sorabiliriz.

        ->  var myObject = {
                    a: 2
            };

            ("a" in myObject); // true
            ("b" in myObject); // false

            myObject.hasOwnProperty( "a" ); // true
            myObject.hasOwnProperty( "b" ); // false


        in operatorü hem objede böyle bir propun olup olmadığına hem de [[Prototype]] zincirinde üst seviyelerde olup olmadığına bakar. Bunun tersine hasOwnProperty(..) zincire bakmadan sadece proplara bakar.

        hasOwnProperty bir prototype'dır ancak Object.crate(null) ile prototipi olmayan objelerde yaratılabilir o durumda çalışmaz. Bu durumda daha komplike bir erişime ihtiyaç vardır, Object.prototype.hasOwnProperty.call(myObject, "a"). Bu bir ödünç almadır.


    *! Enumeration

        for .. in  indisleri dönerken(değerlere ulaşmayı manuel olarak sana bırakır) for .. of değerleri döner. 
        
        foreach : return valueyi önemsemeden her değeri gezer.

        every : Son değere kadar ya da false dönene kadar.

        some : Son değere kadar ya da true dönene kadar.


        for .. of iterator obje olan '@@iterator' ı ve onun next() metodunu kullanarak iterasyon yapar. Gelin bunu manuel olarak yapalım:

        ->  var myArray = [ 1, 2, 3 ];
            var it = myArray[Symbol.iterator]();
            it.next(); // { value:1, done:false }
            it.next(); // { value:2, done:false }
            it.next(); // { value:3, done:false }
            it.next(); // { done:true }

        '@@iterator' objenin kendisi değildir onun yerine objeyi çağıran fonksiyondur.

        next() call'ının return değeri { value: .., done: ..} görünümünde bir obedir. 'value' şuanki iterasyonun değeriyken 'done' ise iterasyonun son olup olmadığını belirten bool değerdir.



















 */

        
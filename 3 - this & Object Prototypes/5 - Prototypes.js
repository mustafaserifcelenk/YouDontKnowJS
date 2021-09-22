/**
    *! [[Prototype]]

        JS'de objeler [[Prototype]] adında içsel propertilere sahiptirler. Bunlar basitçe başka objelere referanstır.


    *! Implicit Shadowing

        ->  var anotherObject = {
                 a: 2
            };
            
            var myObject = Object.create( anotherObject );
            
            anotherObject.a; // 2
            myObject.a; // 2
            
            anotherObject.hasOwnProperty( "a" ); // true
            myObject.hasOwnProperty( "a" ); // false
            
            myObject.a++; // oops, implicit shadowing!
            
            anotherObject.a; // 2
            myObject.a; // 3

            myObject.hasOwnProperty( "a" ); // true


        Eğer [[Get]] prototipi en alt seviyede bir prop'u bulamazsa üst seviyelere bakmaz. Onun yerine o prop'u yaratır.

        Javascriptte bir objeden instantiation yapıldığında diğer OOP diller gibi kopyalama olmaz. Onun yerine o objenin prototipi diğer objeye linklenir(bağlanır).

        ->  function Foo() {
                 // ...
            }
            
            var a = new Foo();

            Object.getPrototypeOf( a ) === Foo.prototype; // true


        Dolayısıyla new keywordü sadece bir objenin prototipini diğer objenin prototipine bağlar.


    *! Mechanics

        ->  function Foo(name) {
             this.name = name;
            }
            
            Foo.prototype.myName = function() {
             return this.name;
            };
            
            var a = new Foo( "a" );
            var b = new Foo( "b" );

            a.myName(); // "a"
            b.myName(); // "b"


        1. this.name = name, a ve b değişkenlerine name değişkenine atar.

        2. Bu ise Foo'ya property atar.

        Önceki snippet'te, a ve b oluşturulduğunda, Foo.prototype nesnesindeki özelliklerin/işlevlerin a ve b nesnelerinin her birine kopyalandığını düşünmek oldukça caziptir. Ancak durum pek öyle değildir.

        Bir önceki tartışmamızda a.constructor === Foo 'nun doğru olmasının constructor'ın üzerinde Foo'yu gösteren bir property olduğu anlamına gelip gelmediğini tartışmıştık. Ancak bu doğru değil.
        














*/
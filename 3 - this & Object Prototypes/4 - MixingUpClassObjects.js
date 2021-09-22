/**
    *! OOP

        Class merkezli programlama. Data Structures denen objeye ait verinin ve davranışın beraber tutulduğu yapılara class denir.

        Standart bir OOP'de taslak olarak görev gören ve herşeyin en genel halinin orada tutulduğu bir stack(yığın) class olur ve bu soyut olur. Bunu kullanmak için onu instantiate ederek concrete(katı) hale getirmeniz gerekir.

    *! Constructor

        Classların instance'ları constructor adında özel bir method tarafından oluşturulur. 


        ->   class CoolGuy {
                 specialTrick = nothing
                 
                 CoolGuy( trick ) {
                    specialTrick = trick
                 }

                 showOff() {
                     output( "Here's my trick: ", specialTrick )
                 }
            }


        CoolGuy instance'ı oluşturmak için class constructor'ı çağırmamız gerekiyor:


        ->  Joe = new CoolGuy( "jumping rope" )
            Joe.showOff() // Here's my trick: jumping rope


        Constructor her zaman new ile çağrılmalı ki böylece motor senin yeni bir instance oluşturacağını bilsin.


        ->  class Vehicle {
             engines = 1

             ignition() {
                output( "Turning on my engine." );
             }

             drive() {
                 ignition();
                 output( "Steering and moving forward!" )
                }
            }
            
            class Car inherits Vehicle {
                 wheels = 4
                 
                 drive() {
                     inherited:drive()
                     output( "Rolling on all ", wheels, " wheels!" )
                 }
            }

            class SpeedBoat inherits Vehicle {
                 engines = 2
                 
                 ignition() {
                     output( "Turning on my ", engines, " engines." )
                 }

                 pilot() {
                     inherited:drive()
                     output( "Speeding through the water with ease!" )
                 }
            }

        Constructor'lar kısalık için yazılmamıştır.

    *! Polymorphism

        Daha fazla spesifik özellik kazandırmak için child class'ın base class'ı override edebilmesidir. Gerçekte, relative polymorphizm override edilen behaivor'dan base behaivor'u referans edebilmemize olanak sağlar. Virtual ve override kullanılarak yapılan polymorphizm virtaul/relative polymorphizmdir. 

        İlk olarak Car, vehicle'dan inherit ettiği(kalıttığı) aynı isimli metodu drive()'ı override ederek, kendi drive() metodunu tanımlıyor. Ama sonra Car'ın drive metodu 'inherited:drive()' ı çağırıyor. Bu Car'ın override edilmemiş inherit edilen asıl drive()'a refere edebildiği anlamına geliyor. SpeedBoat'ın pilot() metodu da kalıtılmış drive()'ın kopyasına refere ediyor.

        Buna polymorphism ya da virtual polymorphism tekniği denir. Kendi durumumuz için daha spesifik olarak relative polymorphism denir. Buradaki relative'in manası her metodun kendinden üst hiyerarşideki her metoda refere edebileceğidir. Relative deriz çünkü kesin olarak hangi inheritence seviyesine erişeceğimizi tanımlamayız. Onun yerine göreli olarak bir seviye yukarıya bak diyerek refere ediyoruz.

        Diğer birçok dilde super keywordü bu örnekteki inherited'in yerine kullanılır. Bu kullanımda superclass mevcut classın parent/ancestor(ebeveyn/ata)'ü anlamındadır.

        Polymorphism'in diğer yönü aynı isimli metotlar farklı inheritance seviyelerinde farklı tanımlara sahip olabilirler ve bu metotlar hangi class'ın seçildiğine göre otomatik olarak seçilirler.

        Klasik class oriented dillerin super aracılığıyla size sağladığı bir başka şey child classın constructorundan parent classın constructor'ına doğrudan erişim vermesidir. Bu genel anlamda doğru çünkü gerçek sınıflarda constructor'lar class'a aittirler. Ancak javascriptte durum tersidir. Js'de sınıfları constructor'a ait olan sınıflar olarak düşünmek daha uygundur. JS'de çocuk ve ebeveyn arasındaki ilişki yalnızca ilgili kurucuların iki .prototype nesnesi arasında var olduğundan, yapıcıların kendileri doğrudan ilişkili değildir ve bu nedenle birini diğerinden göreceli olarak referans almanın basit bir yolu yoktur (bkz. Appendix A: Bunu süper ile “çözen” ES6 ).

        Burada ince bir nokta child class parent class'tan bir method inherit ettiğinde kendi ignition('ını mı kullanır yoksa inherit ettiğini mi kullanır. Kendi ignition()'ını kullanır. Bu işte hangi class'ı çağırdığınıza göre kullanacağınız metodun değiştiği polymorph'a örnektir.

        Class'lar inherit edildiğinde classların kendisinin(ondan yaratılan örneklerinin değil), inherit edildiği classlara referansı bulunur ve bu relative referansa super denilir. 


    *! Mixins

        Tek class'ın birden fazla class'tan kalıtılması için kullanılırlar.

        Javascript object mekanizması siz inherit veya instantiate ettiğinizde otomatik olarak kopyalama yapmaz çünkü objelere kopyalanmaz birbirlerine linklenirler(Javascriptte instantiate edilenler class değildir, objedir. Js'de class yoktur.). 

        Burada bu koyalama işlemini taklit eden mixinleri göreceğiz.


    *! Explicit Mixins

        Js'de otomatik kopyalama mekanizması olmadığından bu tür bir işlem yapan araç yazacağız. Bu tür araçlar genelde extend(..) olarak adlandırılır ancak biz bazı açıklayıcı amaçlar için mixin() diyeceğiz.

        ->  // vastly simplified `mixin(..)` example:
            function mixin( sourceObj, targetObj ) {
                 for (var key in sourceObj) {
                    // only copy if not already present
                    if (!(key in targetObj)) {
                        targetObj[key] = sourceObj[key];
                    }
                }

            return targetObj;

            }

            var Vehicle = {
                engines: 1,    
                ignition: function() {
                    console.log( "Turning on my engine." );
                },
                drive: function() {
                    this.ignition();
                    console.log( "Steering and moving forward!" );
                }
            };

            var Car = mixin( Vehicle, {
                wheels: 4,
                drive: function() {
                    Vehicle.drive.call( this );
                    console.log(
                        "Rolling on all " + this.wheels + " wheels!"
                    );
                }
            } );


            Fonksiyonlar kopyalanmazlar, onun yerine referansları kopyalanır.


    *! Polymorphism'e Yeniden Bakış

        Şu ifadeyi inceleyelim: Vehicle.drive.call( this ). Buna ben explicit pseudopolmorphism diyorum. Bir önceki inherited:drive() pesudocode'u relative polymorphism'dir.
        
        Javascirpt relative polymorphism için (ES6 'dan önce) bir araca sahip değil. Bu yüzden Car ve Vehicle drive() adında aynı isimli metota sahip olduğundan bunları birbirinden ayırmak için absolute bir referans yapmamız gerekir(Explicit olarak Vehicle objesini belirleriz ve onun üzerinden drive fonksiyonunu çağırırız.).
        
        Ancak onun yerine Vehicle.drive() dersek, 'this' binding bu fonksiyon için Car fonksiyonu yerine istemediğimiz Vehicle fonksiyonunu çağıracaktır. Dolayısıyla bunun yerine .call(this) kullanırız ki böylece drive()'ın Car objesi bağlamında çağrıldığından emin oluruz.

        Explicit polymorphism'den olabildiğince kaçınılmalıdır.


    *! Mixin Kopyaları

        




        
        















*/
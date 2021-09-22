/**
    *! This

        -> function identify() {
             return this.name.toUpperCase();
           }

           function speak() {
             var greeting = "Hello, I'm " + identify.call( this );
             console.log( greeting );
           }

           var me = {
            name: "Kyle"
           };

           var you = {
            name: "Reader"
           };

           identify.call( me ); // KYLE
           identify.call( you ); // READER

           speak.call( me ); // Hello, I'm KYLE
           speak.call( you ); // Hello, I'm READER

        
        Bu kodu this olmadan şu şekilde yazabilirdik:

        -> function identify(context) {
             return context.name.toUpperCase();
           }

           function speak(context) {
             var greeting = "Hello, I'm " + identify( context );
             console.log( greeting );
           }

           identify( you ); // READER
           speak( me ); // Hello, I'm KYLE

        Görüldüğü üzere this ile yazılan daha temiz bir yazım.

        Her ne kadar fonksiyonun kendisine obje olarak başvurmak stateleri(propertilerin içindeki değişkenler) fonksiyon çağrımları arasında depolamak için fırsat verdiğini düşünsede kitabın geri kalanı bu stateleri depolamak için daha iyi yerler sağlayan patternlardan bahsedecek.

        Bir fonksiyona foo(i) şeklinde erişirsek daha sonra o fonksiyona fonksiyon içinden this ile erişmeye çalışırsak erişmeyi beklediğimiz obje ile eriştiğimiz obje aynı olmayacaktır. Bunun yerine bu işlemin sağlıklı olması için fonksiyona foo.call(foo, i) şeklinde erişmeliyiz.

    *! Onun Scope'u

        This hakkında düşülen yanlışlardan biri de onun fonksiyonun scope'una eriştiği yönündeki inanıştır. Ancak scope objesi kod ile erişilebilir değildir. Ona sadece engine erişebilir. 

    *! This nedir?

        This'in author-time binding değil runtime binding olduğunu söylemiştik. 

        Bir fonksiyon invoke edildiğinde activation record, diğer adıyla execution context yaratılır. Bu kayıt fonksiyonun nereden çağrıldığını(the call stack), fonksiyonun nasıl invoke edildiğini, hangi parametrelerin geçildiğini içerir. Bu proplardan biri this referansıdır ve fonksiyonun execute edilmesi sırasında kullanılır olur.




*/
<template>
  <div class="postPage">
    <div class="page-wrapper">
      <div class="postPage__line-top">
        <img
          class="postPage__line-top--back"
          src="@/assets/icons/arrow-left.svg"
          @click="$router.go(-1)"
        />
        <h2>Реквизиты</h2>
        <div></div>
      </div>
      <div class="postPage__line-middle">
        <div class="post__subtitle">
          Франчайзинговая сеть «Пельмения» представлена в Санкт-Петербурге семью
          ресторанами моно-кухни:
        </div>
        <p class="post__text">
          «Пельмения на Среднем»<br />«Пельмения на Петровском»<br />ООО
          «Русский продукт»<br />ИНН 7840043933, ОГРН 1157847431422<br />191025,
          г. С-Петербург, ул. Марата, д. 8, лит. А, пом. 7-Н.
        </p>
        <p class="post__text">
          «Пельмения на Среднем»<br />
          «Пельмения на Малой Посадской»<br />
          ООО "ЗАК"<br />
          ИНН 7801644899, ОГРН 1147847424581<br />
          199004, г. С-Петербург, пр. Средний В.О., д. 11,<br />
          лит.А, пом. 3-Н<br />
        </p>
        <p class="post__text">
          «Пельмения на Разъезжей»<br />
          ООО «Пищевые технологии»<br />
          ИНН 7840034400, ОГРН 1157847191920<br />
          191002, г. С-Петербург, ул.Разъезжая, д. 10/15,<br />
          лит. А, пом. 2-Н<br />
        </p>
        <p class="post__text">
          «Пельмения на Фонтанке»<br />
          «Пельмения на Кронверкском»<br />
          ООО «УК «Ресто»<br />
          ИНН 7840039888, ОГРН 1157847323853<br />
          191023, г. С-Петербург, ул. Караванная, д. 24-26,<br />
          лит. А, пом. 16-Н.<br />
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.post__image {
  &--big {
    width: 100%;
  }
  width: 275px;
}
hr {
  border-top: 1px solid $pl-gray;
  outline: none;
}
</style>

<template>
  <div class="postPage">
    <div class="page-wrapper">
      <div class="postPage__line-top">
        <img
          class="postPage__line-top--back"
          src="@/assets/icons/arrow-left.svg"
          @click="$router.go(-1)"
        />
        <h2>Франшиза</h2>
        <div></div>
      </div>
      <div class="postPage__line-middle">
        <div class="post__subtitle">
          Пельменная франшиза "Пельмения" - успешная модель франчайзинга,
          доказавшая свою эффективность!
        </div>
        <p class="post__text">
          Ресторанная франшиза от экспертов с более чем 20-и летним опытом в
          ресторанном бизнесе.
        </p>
        <p class="post__text">
          Прежде чем предложить франшизу нашим партнерам, мы оттачивали модель
          ресторана 10 лет и построили собственную успешную франчайзинговую сеть
          ресторанов в Петербурге.<br />
          Пельмения по франшизе была открыта в Москве, Казани, Нижнием
          Новгороде, Новосибирске, Иркутске, Якутске, Гатчине и в Таллине!<br />
          Вновь открыта франшиза на Москву и Московскую область. Мы
          заинтересованы в партнерах по всей России и в других странах.<br />
          Для получения презентации отправьте заявку на:
          <a href="mailto:zakaz@pelmenya-spb.ru">zakaz@pelmenya-spb.ru</a>
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

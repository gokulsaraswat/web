<template>
  <div id="app">
    <h1>Vue Transitions with GSAP!</h1>
    <button @click="modalOpened = true">View more</button>

    <transition name="modal-open" @enter="modalOpen" @leave="modalClose">
      <article class="modal" v-if="modalOpened">
        <div class="modal__inner">
          <figure class="modal__image">
            <img
              src="https://images.unsplash.com/photo-1554306297-0c86e837d24b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1021&q=80"
              alt="burgers grilling!"
            />
            <figcaption>Photo by Joshua Kantarges</figcaption>
          </figure>
          <section class="modal__content">
            <button class="modal__close" @click="modalOpened = false">
              &times;
            </button>
            <h1>Firehouse Cheeseburgers</h1>
            <p>
              If you love hot sauce with every meal, these burgers are for you.
              We blend ground beef patties with both tangy hot sauce AND Frank’s
              seasoning for layers of spicy, zesty flavor, then top them with
              Monterey Jack for the melt-factor.
            </p>
            <button>Order Now!</button>
          </section>
        </div>
      </article>
    </transition>
  </div>
</template>

<script>
import gsap from "https://cdn.skypack.dev/gsap";

export default {
  data() {
    return {
      message: "Welcome to Vue!",
      modalOpened: false
    };
  },
  methods: {
    doSomething() {
      alert("Hello!");
    },
    modalOpen(el, done) {
      const modalInner = el.querySelector(".modal__inner");
      const image = el.querySelector(".modal__image");
      const content = el.querySelector(".modal__content");

      const modalTL = new gsap.timeline();

      modalTL.set(modalInner, {
        opacity: 0,
        y: 300
      });

      modalTL
        .from(el, {
          opacity: 0,
          duration: 0.35
        })
        .to(
          modalInner,
          {
            opacity: 1,
            y: 0,
            ease: "back.out(1.7)",
            duration: 0.35
          },
          "-=0.25"
        )
        .to(image, {
          x: -150,
          duration: 0.35
        })
        .to(
          content,
          {
            x: 150,
            duration: 0.35,
            onComplete: done
          },
          "<"
        );
    },
    modalClose(el, done) {
      const modalTL = gsap.timeline();

      modalTL.to(el, {
        opacity: 0,
        duration: 0.25,
        onComplete: done
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  cursor: pointer;
  background: none;
  border: solid 1px;
  border-radius: 2em;
  font: inherit;
  padding: 0.75em 2em;
  color: white;
  background-color: rgb(214, 35, 0);
  text-transform: uppercase;
  font-weight: 900;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  &__inner {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  &__image {
    position: absolute;
    z-index: 20;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    aspect-ratio: 1/1;
    height: 300px;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: cover;
    }
  }
  &__content {
    position: absolute;
    z-index: 10;
    box-sizing: border-box;
    padding: 1rem;
    background: #f5ebdc;
    aspect-ratio: 1/1;
    height: 300px;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    h1 {
      padding: 0;
      margin: 0;
    }
  }
  &__close {
    font-size: 2rem;
    box-sizing: border-box;
    padding: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    height: 60px;
    width: 60px;
    border: 0;
    color: rgb(214, 35, 0);
    background: none;
  }
}
</style>

<template>
  <transition name="schdule-modal">
    <div class="schdule-modal-mask">
      <div class="schdule-modal-wrapper">
        <div class="schdule-modal-container">

          <div class="schdule-modal-header">
            <slot name="header">
              default header
            </slot>
            <slot name="button">
            </slot>
          </div>

          <div class="schdule-modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.schdule-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.schdule-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.schdule-modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.schdule-modal-header h3 {
  margin-top: 0;
  color: #42b983;
  display: flex;
  justify-content: space-between;
}

.schdule-modal-body {
  margin: 20px 0;
}

.schdule-modal-default-button {
  float: right;
}

.schdule-modal-enter {
  opacity: 0;
}

.schdule-modal-leave-active {
  opacity: 0;
}

.schdule-modal-enter .schdule-modal-container,
.schdule-modal-leave-active .schdule-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
<template>
  <div>
      <header>헤더 암튼 헤더</header>
      <div class="main">
          <div>
              <!-- 달력 -->
          </div>
      </div>
      <div>
          <!-- 여행지추천 -->
      </div>
  </div>
</template>

<script>
export default {
    
}
</script>

<style>
header {
    height: 30px;
    color: white;
    background-color: black;
}

.main {
    width: 100%;
    background-image: url(./images/korea-main.jpg);
    background-position: center center;
}

.main::before {
    content: "";
    display: block;
    padding-top: 15%;
}

.recommendBtn button {
    font-size: 25px;
    font-weight: 600;
    text-shadow: -1px 0 #D3D3D3, 0 1px #D3D3D3, 1px 0 #D3D3D3, 0 -1px #D3D3D3;
    margin: 1%;
    border-radius: 10px;
    border: 1px solid black;
    padding: 5px 30px;
    background-color: rgba(255, 255, 255, 0.3);
}
</style>
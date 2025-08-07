<template>
  <footer class="custom-footer">
    <div class="container text-center py-4">
      <h5 class="fw-bold mb-2">Generate Data</h5>
      <p class="mb-3">
        Generate Data effortlessly. Fast, clean, and beautiful.
      </p>

      <div class="social-icons mb-3">
        <a
          target="blank"
          href="https://github.com/buingockhanh0306"
          class="me-3"
          ><i class="bi bi-github"></i
        ></a>
        <a
          target="blank"
          href="https://www.linkedin.com/in/buikhanhy2k/"
          class="me-3"
          ><i class="bi bi-linkedin"></i
        ></a>
        <a target="blank" href="mailto:example@example.com"
          ><i class="bi bi-envelope-fill"></i
        ></a>
      </div>

      <p class="small mb-0">©2025 Bui Ngoc Khanh. Made with ❤️ in Vietnam.</p>
    </div>
  </footer>
</template>
<script setup></script>
<style scoped>
.custom-footer {
  background: linear-gradient(to right, #6c63ff, #00bcd4);
  color: white;
}

.custom-footer a {
  color: white;
  font-size: 1.5rem;
  transition: opacity 0.3s ease;
}

.custom-footer a:hover {
  opacity: 0.75;
}

.custom-footer p,
.custom-footer h5 {
  color: white;
}
</style>

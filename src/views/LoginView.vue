<script lang="ts" setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { toTypedSchema } from "@vee-validate/zod";
  import { z } from "zod";
  import { useForm } from "vee-validate";
  import { useAuthStore } from "@/stores/auth";

  const auth = useAuthStore();
  const router = useRouter();
  const serverError = ref("");

  const schema = toTypedSchema(
    z.object({
      email: z
        .string({ message: "El correo es obligatorio" })
        .email({ message: "El correo es inválido." }),
      password: z
        .string({ message: "La contraseña es obligatoria" })
        .min(8, { message: "La contraseña debe tener mínimo 8 caracteres" }),
    }),
  );
  const { errors, handleSubmit, defineField } = useForm({
    validationSchema: schema,
  });

  const [email, emailAttrs] = defineField("email");
  const [password, passwordAttrs] = defineField("password");

  const onSubmit = handleSubmit(async (values) => {
    serverError.value = "";
    const error = await auth.login(values.email, values.password);
    if (error) {
      serverError.value = error;
      return;
    }
    router.push({ name: "dashboard" });
  });
</script>

<template>
  <h1 class="title">Login</h1>

  <section class="section">
    <form class="form" @submit.prevent="onSubmit">
      <fieldset class="form__fieldset">
        <input
          class="form__input"
          type="text"
          placeholder="Email"
          v-model="email"
          v-bind="emailAttrs"
          :class="{ 'form__input--error': errors.email }"
        />
        <span>{{ errors.email }}</span>
      </fieldset>
      <fieldset class="form__fieldset">
        <input
          class="form__input"
          type="password"
          placeholder="Contraseña"
          v-model="password"
          v-bind="passwordAttrs"
          :class="{ 'form__input--error': errors.password }"
        />
        <span>{{ errors.password }}</span>
      </fieldset>

      <p v-if="serverError" class="form__error">{{ serverError }}</p>

      <button class="form__btn" type="submit">Ingresar</button>
    </form>
  </section>
</template>

<style lang="css" scoped>
  .title {
    margin-bottom: 0.5rem;
  }
  .form {
    display: grid;
    gap: 0.75rem;
  }
  .form__fieldset {
    width: 100%;
    display: flex;
    flex-direction: column;
    border: none;
  }
  .form__input,
  .form__btn {
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
  }
  .form__btn {
    cursor: pointer;
  }
  .form__input--error {
    border: 1px solid red;
    outline: 1px solid red;
  }
  .form__error {
    color: red;
  }
</style>
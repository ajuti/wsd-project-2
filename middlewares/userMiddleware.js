const userMiddleware = async(context, next) => {
  const user = await context.state.session.get("user");

  if (user) {
    context.user = user;
  };

  await next();
};

export { userMiddleware };

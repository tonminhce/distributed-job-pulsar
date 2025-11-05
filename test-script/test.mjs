console.log('Command line arguments:', process.argv);

const AUTH_API_URL = process.argv[2] || 'http://localhost:4000/graphql';

const LOGIN_MUTATION = `
    mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            user {
                id
                email
                name
            }
            accessToken
        }
    }
`;

const JOBS_API_URL = process.argv[3] || 'http://localhost:4001/graphql';

const EXECUTE_JOB_MUTATION = `
    mutation ExecuteJob($executeJobInput: ExecuteJobInput!) {
        executeJob(executeJobInput: $executeJobInput) {
            name
        }
    }
`;

async function login(email, password) {
  const response = await fetch(AUTH_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { loginInput: { email, password } },
    }),
  });

  const data = await response.json();
  console.log('Login response:', JSON.stringify(data, null, 2));
  const cookies = response.headers.get('set-cookie');
  return { data, cookies };
}

async function executeJobWithInput(executeJobInput, cookies) {
  const response = await fetch(JOBS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookies },
    body: JSON.stringify({
      query: EXECUTE_JOB_MUTATION,
      variables: { executeJobInput },
    }),
  });

  const data = await response.json();
  return data;
}

(async () => {
  const { data: loginData, cookies } = await login(
    'test@gmail.com',
    'StrongP@ssw0rd123!'
  );

  if (loginData?.data?.login?.user?.id) {
    const n = parseInt(process.argv[4], 10) || 1000;
    console.log(`Executing Fibonacci with n = ${n}`);
    const executeJobInput = {
      name: 'FibonacciJob',
      data: Array.from({ length: n }, () => ({
        iterations: Math.floor(Math.random() * 5000) + 1,
      })),
    };
    const data = await executeJobWithInput(executeJobInput, cookies);
    console.log(data);
  } else {
    console.error('Login failed');
    if (loginData?.errors) {
      console.error(
        'GraphQL Errors:',
        JSON.stringify(loginData.errors, null, 2)
      );
    }
  }
})();

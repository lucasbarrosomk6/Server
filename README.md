# NestJS BullMQ Project

This project demonstrates how to use BullMQ with Nest.js and deploy it to a Kubernetes cluster using Helm.

## Prerequisites

- Docker
- Node.js
- Nest.js
- Helm
- Kubernetes cluster

## Getting Started

1. Clone this repository:

```sh
git clone https://github.com/<username>/<repository>.git
```

2. Install the dependencies:

```sh
cd <repository>
npm install
```

3. Build the Docker image:

````sh
docker build -t <docker-username>/<docker-image>:<tag> .```

````

4. Push the Docker image to Docker Hub:

```sh
docker push <docker-username>/<docker-image>:<tag>
```

5. Create a Kubernetes secret for your Docker registry:

   ```sh
   kubectl create secret docker-registry regcred --docker-server=https://index.docker.io/v1/ --docker-username=<docker-username> --docker-password=<docker-password> --docker-email=<docker-email>
   ```

6. Create a Helm chart:

   ```sh
   helm create <chart-name>
   ```

7. Update the Helm chart with your application's configuration:

   ```sh
    helm install <release-name> <chart-name> --set image.repository=<docker-username>/<docker-image>,image.tag=<tag>,image.pullPolicy=Always,imagePullSecrets[0].name=regcred
   ```

   Replace <docker-username>, <docker-image>, <tag>, <redis-url>, <release-name>, and <release-name> with your own values.

8. Verify that your application is running in your Kubernetes cluster:

   ```sh
   kubectl get pods
   ```

   Replace <kubernetes-cluster-ip> and <node-port> with the IP address and NodePort of your Kubernetes service.

Conclusion
This project demonstrates how to use BullMQ with Nest.js and deploy it to a Kubernetes cluster using Helm. By following the steps in this README.md file, you should be able to build, push, and deploy your own Nest.js application with BullMQ to a Kubernetes cluster using Helm.

```

Please replace <username>, <repository>, <docker-username>, <docker-image>, <tag>, <secret-name>, <docker-server>, <docker-username>, <docker-password>, <docker-email>, <chart-name>, <release-name>, <kubernetes-cluster-ip>, and <node-port> with your own values.
```

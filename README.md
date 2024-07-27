# News Aggregation App with Rocket.Chat

<br />

<div align="center">
  <h3 align="center">News Aggregation App for RocketChat</h3>
  <p>Aggregates news from top websites and displays news in a configurable, user-friendly format with categorization. Provides centralized access to curated news within Rocket.Chat.</p>

  <p align="center">
    <a href="https://github.com/RocketChat/Apps.News-Aggregation">View Demo</a>
    ·
    <a href="https://github.com/RocketChat/Apps.News-Aggregation/issues">Report Bug</a>
    ·
    <a href="https://github.com/RocketChat/Apps.News-Aggregation/issues">Request Feature</a>
  </p>
</div>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

## 📜 Getting Started

### Prerequisites

- You need a Rocket.Chat Server Setup
- Rocket.Chat.Apps CLI,

* In case you don't have run:
  ```sh
  npm install -g @rocket.chat/apps-cli
  ```

### ⚙️ Installation

- Every RocketChat App runs on RocketChat Server, thus every time you want to test, you need to deploy the app with this note. Let's start setting up:

1. Clone the repo
   ```sh
   git clone https://github.com/<yourusername>/Apps.News-Aggregation
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Deploy the app using:

   ```sh
   rc-apps deploy --url <url> --username <username> --password <password>
   ```

<!-- ABOUT THE PROJECT -->

## ✅ About The Project:

The News Aggregation App aims to provide a centralized platform for seamless access to curated news content within Rocket.Chat. It aggregates news from top websites, displaying them in a user-friendly format with complete configurability of sources and categories.

## 👷‍♀️ Architecture:

![arch](https://github.com/user-attachments/assets/55d2d763-24b4-4e84-8a23-50bed4b58070)

## 🚀 Usage:

Use the following slash commands to interact with the app:

```
/news alert: Get the latest news summaries on demand.
/news help: Learn about the app, its features, and how to configure it.
<!-- /news channels: List all channels where the app is configured. -->
/news subscribe: Configure your news preferences through a modal.
/news unsubscribe: Unsubscribe from receiving periodic news updates.
```

## 🧑‍💻 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue.
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: adds some amazing feature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

## 📚 Resources

Here are some links to examples and documentation:

- [Rocket.Chat Apps TypeScript Definitions Documentation](https://rocketchat.github.io/Rocket.Chat.Apps-engine/)
- [Rocket.Chat Apps TypeScript Definitions Repository](https://github.com/RocketChat/Rocket.Chat.Apps-engine)
- [Example Rocket.Chat Apps](https://github.com/graywolf336/RocketChatApps)
- [DemoApp](https://github.com/RocketChat/Rocket.Chat.Demo.App)
- [GithubApp](https://github.com/RocketChat/Apps.Github22)
- Community Forums
  - [App Requests](https://forums.rocket.chat/c/rocket-chat-apps/requests)
  - [App Guides](https://forums.rocket.chat/c/rocket-chat-apps/guides)
  - [Top View of Both Categories](https://forums.rocket.chat/c/rocket-chat-apps)
- [#rocketchat-apps on Open.Rocket.Chat](https://open.rocket.chat/channel/rocketchat-apps)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/RocketChat/Apps.News-Aggregation?style=for-the-badge
[contributors-url]: https://github.com/RocketChat/Apps.News-Aggregation/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/RocketChat/Apps.News-Aggregation?style=for-the-badge
[forks-url]: https://github.com/RocketChat/Apps.News-Aggregation/network/members
[stars-shield]: https://img.shields.io/github/stars/RocketChat/Apps.News-Aggregation?style=for-the-badge
[stars-url]: https://github.com/RocketChat/Apps.News-Aggregation/stargazers
[issues-shield]: https://img.shields.io/github/issues/RocketChat/Apps.News-Aggregation?style=for-the-badge
[issues-url]: https://github.com/RocketChat/Apps.News-Aggregation/issues
[license-shield]: https://img.shields.io/github/license/RocketChat/Apps.News-Aggregation?style=for-the-badge
[license-url]: https://github.com/RocketChat/Apps.News-Aggregation/blob/master/LICENSE.txt

<div align="center">
  <img src="https://user-images.githubusercontent.com/1626923/137323036-91d4262b-74dd-40c3-83da-a405a75de5c8.jpg" alt="Vue Storefront" />
</div>

### Stay connected

[![GitHub Repo stars](https://img.shields.io/github/stars/vuestorefront/vue-storefront?style=social)](https://github.com/vuestorefront/vue-storefront)
[![Twitter Follow](https://img.shields.io/twitter/follow/vuestorefront?style=social)](https://twitter.com/vuestorefront)
[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCkm1F3Cglty3CE1QwKQUhhg?style=social)](https://www.youtube.com/c/VueStorefront)
[![Discord](https://img.shields.io/discord/770285988244750366?label=join%20discord&logo=Discord&logoColor=white)](https://discord.vuestorefront.io)

## Vue Storefront 2 integration with Odoo

This project is a Odoo integration with [Vue Storefront 2](https://github.com/vuestorefront/vue-storefront/).
This integration is being developed and maintained by [ODOOGAP / PROMPTEQUATION](https://www.odoogap.com/) ❤️

Check our [demo](https://vsf.labs.odoogap.com/) server (it's a dev server so could be down sometimes)


## How to start?

1. Copy .env.example to .env
2. DOT NOT COMMIT .env file


```sh
# install dependencies
yarn install

# generate routes and redirects from ODOO
yarn update:routes 
yarn update:redirects

# serve with hot reload at localhost:3000
yarn dev

# build for production and launch server
yarn build
# build local
yarn build:local
```



or use docker-compose

```bash
docker-compose up --build -d
# you might need to
docker-compose restart odoo nginx
```



Want to contribute? Ping us on `odoo` channel on [our Discord](https://discord.vuestorefront.io) or email us at info (at) odoogap.com!

## Resources

- [Vue Storefront Documentation](https://docs.vuestorefront.io/v2/)
- [Odoo integration Documentation](https://docs.vuestorefront.io/odoo)
- [Odoo integration](https://github.com/vuestorefront/odoo)

## Support

If you have any questions about this integration we will be happy to answer them on `odoo` channel on [our Discord](discord.vuestorefront.io).

## Credits

### Authors:

- ODOOGAP / PROMPTEQUATION

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.promptequation.com/"><img src="https://avatars.githubusercontent.com/u/21957046?v=4?s=80" width="80px;" alt=""/><br /><sub><b>cpintofonseca</b></sub></a><br /><a href="https://github.com/vuestorefront/odoo/commits?author=cpintofonseca" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/SDMonteiro"><img src="https://avatars.githubusercontent.com/u/68434298?v=4?s=80" width="80px;" alt=""/><br /><sub><b>SDMonteiro</b></sub></a><br /><a href="https://github.com/vuestorefront/odoo/commits?author=SDMonteiro" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/brunoodoogap"><img src="https://avatars.githubusercontent.com/u/84967663?v=4?s=80" width="80px;" alt=""/><br /><sub><b>brunoodoogap</b></sub></a><br /><a href="https://github.com/vuestorefront/odoo/commits?author=brunoodoogap" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dduarte-odoogap"><img src="https://avatars.githubusercontent.com/u/18329970?v=4?s=80" width="80px;" alt=""/><br /><sub><b>Diogo Duarte</b></sub></a><br /><a href="https://github.com/vuestorefront/odoo/commits?author=dduarte-odoogap" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/odranoelBR"><img src="https://avatars.githubusercontent.com/u/7774534?v=4" width="80px;" alt=""/><br /><sub><b>Leonardo Ribeiro</b></sub></a><br /><a href="https://github.com/vuestorefront/odoo/commits?author=odranoelBR" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

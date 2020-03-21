module.exports = {
  title: "Beka documentation & blog",
  tagline: "Beka documentation and blog",
  url: "https://www.beka.si",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "Bekaxp", // Usually your GitHub org/user name.
  projectName: "docu", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Beka - documentation & blog",
      links: [
        {
          to: "docs/greeting",
          activeBasePath: "docs",
          label: "Docs",
          position: "left"
        },
        { to: "/", label: "Blog", position: "left" },
        {
          href: "https://github.com/Bekaxp/docu",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Style Guide",
              to: "doc1"
            }
          ]
        },
        {
          title: "Social",
          items: [
            {
              label: "Blog",
              to: "/"
            },
            {
              label: "GitHub",
              href: "https://github.com/Bekaxp"
            },
            {
              label: "Twitter",
              href: "https://twitter.com/Beekaxp"
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} beka.si, Inc. Built with Docusaurus.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        blog: {
          path: "./blog",
          routeBasePath: "/"
        },
        docs: {
          path: "./docs",
          sidebarPath: require.resolve("./sidebars.js")
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};

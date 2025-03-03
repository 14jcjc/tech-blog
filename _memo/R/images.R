# twitter-head.png ------------
n = 20000; prop = 0.007; seed = 1
n = 10000; prop = 0.05; seed = 1
colors = kk_pal()(11)
alpha = 0.5

d = generate.df.demo.discrete(
      num = length(colors), n = n, n.class = 5, seed = seed
    )
set.seed(14)
d %<>% slice_sample(prop = prop, weight_by = 1/y2)

ggtheme = theme_ipsum_ext(
    legend_position = "none", axis = F, grid = "Yy", 
    plot_background = T, 
    plot_background_fill = alpha("#1F9CEE", 0.04), 
    plot_background_color = alpha("#1F9CEE", 0.04)
  )

gg = ggboxplot(
    d, x = "grp", y = "y", fill = "grp", color = "grp", alpha = alpha, 
    add = "mean", add.params = list(color = "red", size = 0.2), 
    varwidth = T, 
    ggtheme = ggtheme
  )

gg = gg + 
  rremove("xy.text") + rremove("xylab") + 
  scale_color_kk_d(colors = colors) + 
  scale_y_continuous(limits = c(NA, NA), expand = expansion(mult = c(0.02, 0.02)))

plot(gg)

w = 8
h = w / 3.0
path = "/Users/kk/Downloads/box-0.png"
my.ggsave(path, gg, w = w, h = h, dpi = 600)

#-------------------------------------------------------------------------------

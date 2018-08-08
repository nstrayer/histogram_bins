# Bin Number Animation
data <- purrr::map_df(1:20, ~data_frame(x = rnorm(n = 20, mean = ., sd = 0.1)))

makeFileLoc <- function(bin_number, main = 'width'){
  sprintf('scratch_work/frames/bins_%s_%i.png', main, bin_number) %>% 
    here::here()
}

bins <- c(5, 10, 20, 40, 60, 100)
for (bin_number in bins) {
  p <- ggplot(data, aes(x = x)) + 
    geom_histogram(bins = bin_number) +
    labs(
      title = paste('bins =', bin_number),
      x = ''
    ) +
    xlim(0, 21) 
  
  makeFileLoc(bin_number) %>% 
    ggsave(p, width = 5, height = 5)
}


gifski::gifski(
  purrr::map_chr(bins, makeFileLoc),
  gif_file = here::here('scratch_work/bin_num_changes.gif'),
  delay = 1
)

##########################################################
# Bin Offsets
##########################################################

num_bars <- 40
bar_width <- 21/num_bars
offsets <- seq(0, 100, by = 1)

for (offset in offsets) {
  offset_length <- bar_width*(offset/100)
  bin_breaks <- seq(offset_length,21 + offset_length,length.out = num_bars)
  
  p <- ggplot(data, aes(x = x)) + 
    geom_histogram(breaks = bin_breaks) +
    labs(
      title = paste0('bin offset = ', offset, '%'),
      x = ''
    ) +
    xlim(0, 21) 
  
  makeFileLoc(offset, main = 'offset') %>% 
    ggsave(p, width = 5, height = 5)
}

gifski::gifski(
  purrr::map_chr(offsets, ~makeFileLoc(., main = 'offset')),
  gif_file = here::here('scratch_work/bin_offset_changes.gif'),
  delay = 0.1
)

#########
# Opacity overlayed histogram
#########

data <- purrr::map_df(1:20, ~data_frame(x = rnorm(n = 20, mean = ., sd = 0.1)))

bins <- c(5, 10, 20, 40, 60, 100)
bins <- seq(5, 100, by = 5)
p <- ggplot(data, aes(x = x)) +
  labs( x = '') +
  xlim(0, 21) 

for (bin_number in bins) {
  p <- p + geom_histogram(bins = bin_number, alpha = 0.03) 
}

p

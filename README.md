# MNIST Softmax Regression Lab

## Yêu cầu hệ thống

- Python 3.10+
- Conda hoặc Miniconda

## Cài đặt Environment

### Sử dụng environment.yml (Khuyến nghị)

```bash
# Tạo environment từ file
conda env create -f environment.yml

# Activate environment
conda activate mnist-lab

# Đăng ký kernel với Jupyter
python -m ipykernel install --user --name mnist-lab --display-name "Python (MNIST Lab)"
```

## Xóa Environment (nếu cần)

```bash
# Deactivate trước
conda deactivate

# Xóa environment
conda env remove -n mnist-lab

# Xóa kernel
jupyter kernelspec uninstall mnist-lab
```

